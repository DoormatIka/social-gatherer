// REFRACTORED TWITTER 
import { TwitterState } from "./api/state";
import { LiveTwitter } from "./api/live";
import { DelayedTwitter } from "./api/delayed";
import { TwitterApiWrapper } from "./api/api";
import { Background, Color, Foreground, colorlog } from "../../../utils/printcolor";
import { User, UserJSON } from "../base";
type Options = {
    includeReplies: boolean,
    includeRetweets: boolean
}
export interface TwitterJSON extends UserJSON {
    bearerToken: string,
    msRefresh: number,
    memory: TwitterMemory,
}
interface TwitterMemory {
    tweetid: string
}

/**
 * USES THE TWITTER API.
 *
 * Twitter class to interact with the Twitter API
 * @param bearerToken - the bearer token found in the developer website
 * @param userId - the username found here: https://twitter.com/[userId]
 * @param msRefresh - how many times it will update the API (with getTweetListener)
 * 
 * Recommended msRefresh: 30000ms / 30s (to avoid hitting rate-limits)
 */
export class TwitterUser implements User<TwitterJSON, TwitterMemory> {
  private path = "/twitter"
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
      console.log(colorlog(
        `%>[WARN]%<: ${this.toString()} | %>msRefresh too low!%< Should be above %>30000ms%<.`,
        new Color({bg: Background.red}), new Color({fg: Foreground.yellow}), new Color({fg: Foreground.yellow})
      ))
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
  getPath() {
    return this.path;
  }
}

export class TwitterFactory {
    convertJSON(json: TwitterJSON[]) {
        return json.map(v => {
            const init = new TwitterUser(v.userId, v.bearerToken, v.msRefresh);
            init.setJSON(v.memory);
            return init;
        })
    }
}