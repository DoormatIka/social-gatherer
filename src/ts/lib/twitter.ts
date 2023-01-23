import { TwitterApi, TwitterApiReadOnly } from "twitter-api-v2";
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"

type TwitEvents = {
    tweeted: (text: string, sensitive?: boolean) => void
}

type TwitterMemory = {
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
    constructor(
        bearerToken: string,
        public userId: string,
        public msRefresh: number
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

    private async getUserTweets(options?: { includeReplies: boolean, includeRetweets: boolean }) {
        const excluded: ("replies"|"retweets")[] = [];
        if (options) {
            const { includeReplies, includeRetweets } = options;
            if (!includeReplies ) excluded.push("replies");
            if (!includeRetweets) excluded.push("retweets")
        }

        const id = (await this.client.v2.userByUsername(this.userId)).data.id;
        const tweets = await this.client.v2.userTimeline(id, {
            max_results: 5,
            exclude: excluded || ["replies", "retweets"],
        })
        return tweets.data;
    }
}