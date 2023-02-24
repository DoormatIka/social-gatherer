import { TweetV2 } from "twitter-api-v2";

interface TwitterMemory {
    tweetId: string
}

export class TwitterState {
  constructor(public data: TwitterMemory) {}
  public setEmptyTweetId(currentTweet: TweetV2) {
    if (this.data.tweetId.length == 0) {
      this.data.tweetId = currentTweet.id;
      return currentTweet.id;
    }
  }
}
