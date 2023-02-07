import { TwitterApiWrapper } from "./api"
import { TwitterState } from "../state";
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type TwitEvents = {
    tweeted: (text: string, sensitive?: boolean) => void,
}
type Options = {
    includeReplies: boolean,
    includeRetweets: boolean
}

export class LiveTwitter { 
  private event = new EventEmitter() as TypedEmitter<TwitEvents>;
  private api: TwitterApiWrapper;
  constructor(
    private state: TwitterState,
    private msRefresh: number,
    private userId: string,
    bearerToken: string
  ) {
    this.api = new TwitterApiWrapper(bearerToken);
  }
  async enableTweetEvent(options?: Options) {
    setInterval(async () => {
      // there needs to be state management between these classes.
      const currentTweet = await this.api.getCurrentTweet(this.userId, options);
      if (currentTweet) {
        this.state.setEmptyTweetId(currentTweet);
          // if memory tweetId is not equal to current tweetId
          // aka. you tweeted something!
          if (this.state.data.tweetId !== currentTweet.id) {
            this.event.emit("tweeted", currentTweet.text, currentTweet.possibly_sensitive);
            this.state.data.tweetId = currentTweet.id;
          }
        }
      }, this.msRefresh)
  }
  getEventEmitter() {
    return this.event;
  }
}
