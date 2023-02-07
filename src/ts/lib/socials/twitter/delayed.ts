import { TwitterApiWrapper } from "./api"
import { TwitterState } from "../state";

type Options = {
    includeReplies: boolean,
    includeRetweets: boolean
}

// connect it to the delayed functions
export class DelayedTwitter {
  private api: TwitterApiWrapper
  constructor(
    private state: TwitterState,
    private userId: string,
  ) {
    this.api = new TwitterApiWrapper("");
  }
  
  async getDelayedTweets(options?: Options) { 
    const currentTweet = await this.api.getCurrentTweet(this.userId);
    if (!currentTweet) return;
        
    this.state.setEmptyTweetId(currentTweet);
    const { tweets, foundIndex } = await this.fetchDelayedTweets(options);
    return tweets.data.filter((_, i) => i < foundIndex);
  }
  private async fetchDelayedTweets(options?: Options) {
    let tweets, token
    let foundIndex: number;
    while (true) {
      tweets = await this.api.getTweets(this.userId, options);
      foundIndex = tweets.data.findIndex(v => v.id === this.state.data.tweetId);
      token = tweets.meta?.next_token;
      if (foundIndex !== -1) {
        const latestTweet = tweets.data.at(0);
        if (latestTweet) {
          this.state.data.tweetId = latestTweet.id;
        }
        break;
      }
      if (!token) break;
    }

    return { tweets, foundIndex };
  }
}
