import { TwitterApi, TwitterApiReadOnly, TweetV2PaginableTimelineResult } from "twitter-api-v2";
import { ExternalStorage } from "./buffer"
import api from "../../../secrets/api.json"

import EventEmitter from "events"
import TypedEmitter from "typed-emitter"

type TwitEvents = {
    tweeted: (text: string, sensitive?: boolean) => void,

}

type TwitterMemory = {
    // to be stored in database
    tweet_id: string,
    time: string
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
        this.innateMemory = { tweet_id: "", time: "" };
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
        // where you'll get the eventListener to get tweets after it turns on
    }

    // helper functions
    public async getUserTweets(
        options?: {
            includeReplies: boolean, 
            includeRetweets: boolean 
        }) {
        
        const excluded = this.convertIncludeToExclude(options);
        const user = await this.client.v2.userByUsername(this.userId)
        const id = user.data.id;

        // this function returns the user's post history
        const tweets = await this.client.v2.userTimeline(id, {
            max_results: 5, // do i get 100 tweets to search and get missed tweets?
            exclude: excluded,
        })
        return tweets.data;
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
    const lilyn = new TwitterUser(api.twitter_bearerToken, "bannedvtmemes", 5000);
    const tweets = await lilyn.getUserTweets()
}
main()