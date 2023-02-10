// REFRACTORED TWITTER 
import { TwitterState } from "./state";
import { LiveTwitter } from "./live";
import { DelayedTwitter } from "./delayed";
import { TwitterApiWrapper } from "./api";
import { twitter_bearerToken } from "../../../../../secrets/api.json"
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
  public state: TwitterState
  private live: LiveTwitter
  private delayed: DelayedTwitter
  constructor(
    private userId: string,
    private bearerToken: string,
    private msRefresh: number,
  ) {
      const api = new TwitterApiWrapper(this.bearerToken);
      this.state = new TwitterState({ tweetId: "" });
      this.live = new LiveTwitter(
        this.state, 
        this.msRefresh, 
        this.userId, 
        api);
      this.delayed = new DelayedTwitter(
        this.state, 
        this.userId, 
        api);
      if (this.msRefresh < 30000) {
            // make a function for colors
            // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
            console.log(`\x1b[33m[WARN]\x1b[0m ${this.toString()} || msRefresh is too low! It should be above 30000ms`)
      }
    }
    getEventEmitter() {
      return this.live.getEventEmitter();
    }
    async enableTweetEvent(options?: Options) {
      await this.live.enableTweetEvent(options);
    }
    async getDelayedTweets(options?: Options) {
      return await this.delayed.getDelayedTweets(options);
    }
    toString() {
        return `TwitterUser (${this.userId}) [Refresh (ms): ${this.msRefresh}]`
    }
    ///////// needed methods //////////
    getJSON(): TwitterJSON {
        return {
            bearerToken: this.bearerToken,
            userId: this.userId,
            msRefresh: this.msRefresh,
            memory: { tweetid: this.state.data.tweetId }
        };
    }
    setJSON(memory: TwitterMemory) {
        this.state.data.tweetId = memory.tweetid;
    }
}

async function main() { // Unauthorized
  const tw = new TwitterUser("LilynHana", twitter_bearerToken, 10000);
  // tw.setJSON({ tweetid: "1623708329930551297" })
  const delayedTweets = await tw.getDelayedTweets({ includeReplies: false, includeRetweets: true });
  console.dir(`Starting: ${JSON.stringify(delayedTweets, undefined, 2)}`, { depth: 3 })
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
