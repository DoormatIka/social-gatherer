<<<<<<< HEAD:src/ts/lib/socials/twitter/twitter.ts
import { TweetV2PaginableTimelineResult, TweetV2 } from "twitter-api-v2";
import { TwitterApiWrapper } from "./api"
import { bearer_token } from "../../../../../secrets/api.json";
=======
import { TwitterApi, TwitterApiReadOnly, TweetV2PaginableTimelineResult, TweetV2 } from "twitter-api-v2";
import { twitter_bearerToken } from "../../../secrets/api.json";
>>>>>>> 5668a234a274c70dcab32e7e2c3dc072f4c43455:src/ts/lib/twitter.ts
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type TwitEvents = {
    tweeted: (text: string, sensitive?: boolean) => void,
}
type Options = {
    includeReplies: boolean,
    includeRetweets: boolean
}
export interface TwitterJSON {
    bearerToken: string,
    userId: string,
    msRefresh: number,
    memory: TwitterMemory,
}
interface TwitterMemory {
    tweetid: string
}

/**
 * USES THE TWITTER API, WILL CONVERT TO SCRAPER SOON
 *
 * Twitter class to interact with the Twitter API
 * @param bearerToken - the bearer token found in the developer website
 * @param userId - the username found here: https://twitter.com/[userId]
 * @param msRefresh - how many times it will update the API (with getTweetListener)
 * 
 * Recommended msRefresh: 30000ms / 30s (to avoid hitting rate-limits)
 */
export class TwitterUser { 
    private event = new EventEmitter() as TypedEmitter<TwitEvents>
    private api: TwitterApiWrapper
    private tweetId: string = ""
    constructor(
        private userId: string,
        private bearerToken: string,
        private msRefresh: number
    ) {
      this.api = new TwitterApiWrapper(bearerToken)
    }
    getEventEmitter() {
        return this.event;
    }
    async enableTweetEvent(options?: Options) {
        setInterval(async () => {
            const currentTweet = await this.getCurrentTweet(options);
            if (currentTweet) {
                this.setEmptyTweetId(currentTweet);
                // if memory tweetId is not equal to current tweetId
                // aka. you tweeted something!
                if (this.tweetId !== currentTweet.id) {
                    this.event.emit("tweeted", currentTweet.text, currentTweet.possibly_sensitive);
                    this.tweetId = currentTweet.id;
                }
            }
        }, this.msRefresh)
    }

    // delayed tweets ========================
    async getDelayedTweets(options?: Options) {
        const currentTweet = await this.getCurrentTweet(options);
        if (!currentTweet) return;
        
        this.setEmptyTweetId(currentTweet);
        const { tweets, foundIndex } = await this.fetchDelayedTweets(options);
        return tweets.data.filter((_, i) => i < foundIndex);
    }

    // helper functions
    private async fetchDelayedTweets(options?: Options) {
        let tweets, token
        let foundIndex: number;
        while (true) {
            tweets = await this.getUserTweets(options, token);
            foundIndex = this.findTweetbyIndex(tweets, this.tweetId);
            token = tweets.meta?.next_token;

            if (foundIndex !== -1) {
                const latestTweet = tweets.data.at(0);
                if (latestTweet) {
                    this.tweetId = latestTweet.id;
                }
                break;
            }
            if (!token) break;
        }
        return { tweets, foundIndex };
    }
    private setEmptyTweetId(currentTweet: TweetV2) {
        if (this.tweetId.length == 0) {
            this.tweetId = currentTweet.id;
            return currentTweet.id;
        }
    }
    private findTweetbyIndex(tweets: TweetV2PaginableTimelineResult, id: string) {
        const foundIndex = tweets.data.findIndex(v => v.id === id);
        return foundIndex;
    }

    private async getUserTweets(options?: Options, nextToken?: string) {
      return this.api.getTweets(this.userId, options, nextToken);
    }
    private async getCurrentTweet(options?: Options) {
      return this.api.getCurrentTweet(this.userId, options)
    } 

    ///////// needed methods //////////
    getJSON(): TwitterJSON {
        return {
            bearerToken: this.bearerToken,
            userId: this.userId,
            msRefresh: this.msRefresh,
            memory: { tweetid: this.tweetId }
        };
    }
    setJSON(memory: TwitterMemory) {
        this.tweetId = memory.tweetid
    }
}


async function main() {
    const tw = new TwitterUser("LilynHana", bearer_token, 10000);
    for (let i = 0; i < 2; i++) {
        console.log( await tw.getDelayedTweets({ includeRetweets: true, includeReplies: false }) )
    }
}
main()


export class TwitterFactory {
    convertJSON(json: TwitterJSON[]) {
        const tw: TwitterUser[] = [];
        for (const j of json) {
            const init = new TwitterUser(j.userId, j.bearerToken, j.msRefresh);
            init.setJSON(j.memory)
            tw.push(init);
        }
        return tw;
    }
}

export class TwitterSerializer {
    convertObject(yt: TwitterUser[]) {
        const json: TwitterJSON[] = [];
        for (const y of yt) {
            json.push(y.getJSON())
        }
        return json;
    }
}
