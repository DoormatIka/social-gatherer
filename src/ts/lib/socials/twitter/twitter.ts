// REFRACTORED TWITTER 
import { TwitterState } from "./state";
import { LiveTwitter } from "./live";
import { DelayedTwitter } from "./delayed";
import { TwitterApiWrapper } from "./api";
import { bearer_token } from "../../../../../secrets/api.json"
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
  private state: TwitterState
  private live: LiveTwitter
  private delayed: DelayedTwitter
  private tweetId: string = ""
  constructor(
    private userId: string,
    private bearerToken: string,
    private msRefresh: number,
  ) {
    console.log(this.bearerToken);
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
  }
    getEventEmitter() {
      return this.live.getEventEmitter();
    }
    async enableTweetEvent(options?: Options) {
      await this.live.enableTweetEvent(options);
    }
    async getDelayedTweets(options?: Options) {
      await this.delayed.getDelayedTweets(options);
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
  tw.setJSON({ tweetid: "1621938660332519425" })
  // await tw.getDelayedTweets({ includeReplies: false, includeRetweets: true });
  await tw.enableTweetEvent()
  const a = await tw.getEventEmitter();
  a.on("tweeted", (t, s) => console.log(t, s)) 
  // reset your twitter bearer Token or whatever
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
