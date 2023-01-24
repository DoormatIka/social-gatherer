import { TwitterApi, TwitterApiReadOnly, TweetV2PaginableTimelineResult } from "twitter-api-v2";
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"
import { Storage } from "./buffer"

type TwitEvents = {
    tweeted: (text: string, sensitive?: boolean) => void
}

type TwitterMemory = {
    // to be stored in database
    tweet_id: string,
}

export type TwitterJSON = {
    userId: string,
    msRefresh: number,
    innateMemory: TwitterMemory,
    bearerToken: string,
}
/**
 * Twitter class to interact with the Twitter API
 * @param bearerToken - the bearer token found in the developer website
 * @param userId - the username found here: https://twitter.com/[userId]
 * @param msRefresh - how many times it will update the API (with getTweetListener)
 * 
 * Recommended msRefresh: 30000ms / 30s
 */
export class TwitterUser {
    private event: TypedEmitter<TwitEvents>
    private client: TwitterApiReadOnly
    private innateMemory: TwitterMemory
    private innateStorage: Array<TweetV2PaginableTimelineResult> = []
    constructor(
        bearerToken: string,
        public userId: string,
        public msRefresh: number,
    ) {
        const t = new TwitterApi(bearerToken);
        this.client = t.readOnly;
        this.innateMemory = { tweet_id: "" };
        this.event = new EventEmitter() as TypedEmitter<TwitEvents>
    }
    /**
     * listens to events that happens in Twitter accounts every msRefresh
     * 
     * streams weren't used since they had rate limits
     * @returns - An EventEmitter
     * 
     */
    async getTweetListener(options?: { includeReplies: boolean, includeRetweets: boolean }) {
        setInterval(async () => {
            const tweets = await this.getUserTweets(options);
            const currentTweet = tweets.data.at(0);
            if (!currentTweet) return;

            // if there's no tweetId's saved in memory
            if (this.innateMemory.tweet_id.length === 0) {
                this.innateMemory.tweet_id = currentTweet.id;
                return;
            }

            // if memory tweetId is not equal to current tweetId
            if (this.innateMemory.tweet_id !== currentTweet.id) {
                this.event.emit("tweeted", currentTweet.text, currentTweet.possibly_sensitive); 
                this.innateMemory.tweet_id = currentTweet.id;
            }
        }, this.msRefresh)

        return this.event;
    }

    async getDelayedTweetListener() {

    }

    public async getUserTweets(
        options?: { 
            includeReplies: boolean, 
            includeRetweets: boolean 
        }, sinceID?: string) {
        const excluded: ("replies"|"retweets")[] = [];
        if (options) {
            const { includeReplies, includeRetweets } = options;
            if (!includeReplies ) excluded.push("replies");
            if (!includeRetweets) excluded.push("retweets")
        }

        const id = (await this.client.v2.userByUsername(this.userId)).data.id;
        const tweets = await this.client.v2.userTimeline( id, {
            max_results: 5,
            exclude: excluded || ["replies", "retweets"],
            since_id: sinceID
        })
        return tweets.data;
    }

    private async getDelayedTweets(
        options?: {
            includeReplies: boolean, 
            includeRetweets: boolean 
        }) {
        while (true) {
            const tweets = await this.getUserTweets(options, this.innateMemory.tweet_id); 
            if (tweets.data.length === 0) {
                break;
            }
            // what's the stopping condition for tweets, tests needed
            this.innateStorage.push(tweets)
            // this.buffer.add()
            // the storage is supposed to store the last tweet_id to database
            // the "memory" of the object should be the storage for bufferedTweets
        }
    }
}


