import { TwitterApi, TwitterApiReadOnly, TweetV2, TweetV2PaginableTimelineResult } from "twitter-api-v2";
import api from "../../../secrets/api.json"
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type TwitEvents = {
    tweeted: (text: string, sensitive?: boolean) => void,
    delayedTweeted: (data: { text: string, sensitive?: boolean }[]) => void    
}
type TwitterMemory = {
    // to be stored in database
    tweet_id: string,
    time: string
}
type Options = {
    includeReplies: boolean, 
    includeRetweets: boolean 
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
        public msRefresh: number,
    ) {
        const t = new TwitterApi(bearerToken);
        this.client = t.readOnly;
        this.innateMemory = { tweet_id: "", time: "" };
        this.event = new EventEmitter() as TypedEmitter<TwitEvents>
    }
    
    getEventEmitter() {
        return this.event;
    }
    /**
     * listens to events that happens in Twitter accounts every msRefresh
     * 
     * streams weren't used since they had rate limits
     * @returns - An EventEmitter
     * 
     */
    async enableTweetEvent(options?: Options) {
        setInterval(async () => {
            const currentTweet = await this.getCurrentTweet(options);
            if (!currentTweet) return;
            // if there's no tweetId's saved in memory
            if (this.innateMemory.tweet_id.length === 0) {
                this.innateMemory.tweet_id = currentTweet.id;
                return;
            }
            // if memory tweetId is not equal to current tweetId
            // aka. you tweeted something!
            if (this.innateMemory.tweet_id !== currentTweet.id) {
                this.event.emit("tweeted", currentTweet.text, currentTweet.possibly_sensitive); 
                this.innateMemory.tweet_id = currentTweet.id;
            }
        }, this.msRefresh)
    }

    async enableDelayedTweetsEvent(options?: { includeReplies: boolean, includeRetweets: boolean }) {
        // the event will only be run once. (on turn on)
        // if memory_id isn't equal to tweet_id (twitter)
        //     run the event and get the array from getDelayedTweets
        // 

        const currentTweet = await this.getCurrentTweet(options)
        if (!currentTweet) return; 
        // checking if tweet_id is null
        if (this.innateMemory.tweet_id.length === 0) {
            this.innateMemory.tweet_id = currentTweet.id;
            return;
        }

        const tweets = await this.getDelayedTweets(
            this.innateMemory.tweet_id,
            options
        )
        // check if you missed a tweet or not before emitting the event
        console.log(tweets);
    }

    // helper functions (turn to private later)
    public async getUserTweets(options?: {
            includeReplies: boolean, 
            includeRetweets: boolean 
        }, nextToken?: string) {
        
        const excluded = this.convertIncludeToExclude(options);
        const user = await this.client.v2.userByUsername(this.userId)
        const id = user.data.id;

        // this function returns the user's post history
        const tweets = await this.client.v2.userTimeline(id, {
            max_results: 5, // use pagination
            exclude: excluded,
            pagination_token: nextToken
        })
        return tweets.data;
    }

    public async getDelayedTweets(tweetID: string, options?: {
        includeReplies: boolean, 
        includeRetweets: boolean
    }) {
        const tweets: Array<TweetV2> = []
        let token: string | undefined;
        let tw: TweetV2PaginableTimelineResult;
        while (true) {
            tw = await this.getUserTweets(options, token);
            if (!tw.meta.next_token) break;

            const found = tw.data.find(v => v.id === tweetID);
            tweets.push(...tw.data)
            if (found) break;
            token = tw.meta.next_token;
        }
        return tweets;
    }

    private async getCurrentTweet(options?: Options) {
        const tweets = await this.getUserTweets(options);
        return tweets.data.at(0); 
    }

    private async checkMemoryTweetID() {

    }

    private convertIncludeToExclude(option?: { includeReplies: boolean, includeRetweets: boolean }) {
        const included: ("replies"|"retweets")[] = ["replies", "retweets"];

        if (option) {
            const { includeReplies, includeRetweets } = option;
            if (includeReplies ) included.splice(0, 1);
            if (includeRetweets) included.splice(1, 1);
        }
        return included;
    }
}


async function main() { // testing
    const lilyn = new TwitterUser(api.bearer_token, "danimato_", 5000);
    // getting all tweets after tweet ID: 1608485058733826050
    await lilyn.getDelayedTweets("1608485058733826050");
    console.log(  )
}
main()
