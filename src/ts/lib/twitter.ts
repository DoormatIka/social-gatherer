import { TwitterApi, TwitterApiReadOnly } from "twitter-api-v2";
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
    private client: TwitterApiReadOnly
    private tweetId: string = ""
    constructor(
        private userId: string, 
        private bearerToken: string, 
        private msRefresh: number
    ) {
        const t = new TwitterApi(this.bearerToken);
        this.client = t.readOnly;
    }
    getEventEmitter() {
        return this.event;
    }
    async enableTweetEvent(options?: Options) {
        setInterval(async () => {
            const currentTweet = await this.getCurrentTweet(options);
            if (currentTweet) {
                // if there's no tweetId's saved in memory
                if (this.tweetId.length === 0) {
                    this.tweetId = currentTweet.id;
                    return;
                }
                // if memory tweetId is not equal to current tweetId
                // aka. you tweeted something!
                if (this.tweetId !== currentTweet.id) {
                    this.event.emit("tweeted", currentTweet.text, currentTweet.possibly_sensitive); 
                    this.tweetId = currentTweet.id;
                }
            }
        }, this.msRefresh)
    }
    async getDelayedTweets(options?: Options) {
        const currentTweet = await this.getCurrentTweet(options);
        if (!currentTweet) return;
        // if there's no tweetID's saved
        if (this.tweetId.length == 0) {
            this.tweetId = currentTweet.id;
            return;
        }
        
        let tweets;
        let foundIndex: number;
        let token: string | undefined;
        while (true) {
            tweets = await this.getUserTweets(options, token);
            foundIndex = tweets.data.findIndex(c => c.id === this.tweetId);
            if (foundIndex != -1) {
                const latestTweet = tweets.data.at(0);
                if (latestTweet) {
                    this.tweetId = latestTweet.id;
                }
                break;
            }
            if (tweets.meta.next_token) {
                token = tweets.meta.next_token;
            } else {
                break;
            }
        }
        
        return tweets.data.filter((_, i) => i <= foundIndex);
    }

    
    // helper functions
    private async getUserTweets(options?: Options, nextToken?: string) { 
        const excluded = this.convertIncludeToExclude(options);
        const user = await this.client.v2.userByUsername(this.userId);
        const id = user.data.id;

        // this function returns the user's post history
        const tweets = await this.client.v2.userTimeline(id, {
            max_results: 5, // use pagination
            exclude: excluded,
            pagination_token: nextToken
        });
        return tweets.data;
    }
    private async getCurrentTweet(options?: Options) {
        const tweets = await this.getUserTweets(options);
        if (tweets.meta.result_count < 1)
            return undefined;
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

/*
async function main() {
    const tw = new TwitterUser("LilynHana", bearer_token, 10000);
    for (let i = 0; i < 2; i++) {
        console.log( await tw.getDelayedTweets({ includeRetweets: true, includeReplies: false }) )
    }
}
main()
*/

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
