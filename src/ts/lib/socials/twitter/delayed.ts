import { TwitterApiWrapper } from "./api"
import { TwitterState } from "./state";

type Options = {
    includeReplies: boolean,
    includeRetweets: boolean
}

// connect it to the delayed functions
export class DelayedTwitter {
  constructor(
    private state: TwitterState,
    private userId: string,
    private api: TwitterApiWrapper
  ) {}
  
  async getDelayedTweets(options?: Options) { 
    const currentTweet = await this.api.getCurrentTweet(this.userId, options);
    if (!currentTweet) return;
        
    this.state.setEmptyTweetId(currentTweet);
    return await this.fetchDelayedTweets(options);
  }
  private async fetchDelayedTweets(options?: Options) {
    let tweets, token
    let foundIndex: number;
    while (true) {
      tweets = await this.api.getTweets(this.userId, options, token);
      foundIndex = tweets.data.findIndex(v => v.id === this.state.data.tweetId);

      // console.log(foundIndex, tweets)
      // keeps repeating, not paginated.

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

    return tweets.data.filter((_, i) => i < foundIndex);
  }
}
