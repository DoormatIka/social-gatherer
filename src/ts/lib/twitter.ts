import { TwitterApi, TwitterApiReadOnly, TweetV2, TweetV2PaginableTimelineResult } from "twitter-api-v2";
import { Plug } from "./adapter";

import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type TwitEvents = {
    tweeted: (text: string, sensitive?: boolean) => void,
}
interface TwitterMemory {
    // to be stored in database
    tweet_id: string,
}
type Options = {
    includeReplies: boolean, 
    includeRetweets: boolean 
}
export interface TwitterParameters {
    bearerToken: string,
    userId: string,
    msRefresh: number,
}
/**
 * Twitter class to interact with the Twitter API
 * @param bearerToken - the bearer token found in the developer website
 * @param userId - the username found here: https://twitter.com/[userId]
 * @param msRefresh - how many times it will update the API (with getTweetListener)
 * 
 * Recommended msRefresh: 30000ms / 30s (to avoid hitting rate-limits)
 */
export class TwitterUser {
    private plug: Plug = new Plug()
    private event: TypedEmitter<TwitEvents>
    private client: TwitterApiReadOnly
    private innateMemory: TwitterMemory & TwitterParameters
    constructor(parameters: TwitterParameters, memory?: TwitterMemory) {
        this.innateMemory = { 
            ...parameters, 
            ...memory ?? { tweet_id: "" }
        };
        const t = new TwitterApi(this.innateMemory.bearerToken);
        this.client = t.readOnly;
        this.event = new EventEmitter() as TypedEmitter<TwitEvents>
    }
    getEventEmitter() {
        return this.event;
    }
    /**
     * listens to events that happens in Twitter accounts every msRefresh
     * 
     * streams weren't used since they had rate limits
     * @param options - if you want to includeReplies and includeRetweets = boolean
     * @returns - An EventEmitter
     * 
     */
    async enableTweetEvent(options?: Options) {
        setInterval(async () => {
            const currentTweet = await this.getCurrentTweet(options);
            if (currentTweet) {
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
            }
        }, this.innateMemory.msRefresh)
    }
    /**
     * Gets the tweets you missed while the program was offline.
     * 
     * For an example: head to ./src/examples/offline.ts
     * @param options - if you want to includeReplies and includeRetweets = boolean
     * @returns Tweets
     */
    public async getDelayedTweets(options?: Options) {
        const currentTweet = await this.getCurrentTweet(options);
        if (!currentTweet) return;
        // if there's no tweetID's saved
        if (this.innateMemory.tweet_id.length == 0) {
            this.innateMemory.tweet_id = currentTweet.id;
            return;
        }

        const tweets: Array<TweetV2> = []
        let token: string | undefined;
        let tw: TweetV2PaginableTimelineResult;
        while (true) {
            tw = await this.getUserTweets(options, token);
            if (!tw.meta.next_token) break;

            const found = tw.data.find(v => v.id === this.innateMemory.tweet_id);
            tweets.push(...tw.data)
            if (found) break; // if 
            token = tw.meta.next_token;
        }
        const latestTweet = tweets.at(0);
        if (latestTweet) {
            this.innateMemory.tweet_id = latestTweet.id
        }
        return tweets;
    }

    // helper functions
    private async getUserTweets(options?: Options, nextToken?: string) {
        
        const excluded = this.convertIncludeToExclude(options);
        const user = await this.client.v2.userByUsername(this.innateMemory.userId)
        const id = user.data.id;

        // this function returns the user's post history
        const tweets = await this.client.v2.userTimeline(id, {
            max_results: 5, // use pagination
            exclude: excluded,
            pagination_token: nextToken
        })
        return tweets.data;
    } 

    private async getCurrentTweet(options?: Options) {
        const tweets = await this.getUserTweets(options);
        return tweets.data.at(0); 
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
