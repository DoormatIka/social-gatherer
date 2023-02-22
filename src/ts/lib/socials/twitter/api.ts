import { TwitterApi, TwitterApiReadOnly } from "twitter-api-v2";

type Options = {
    includeReplies: boolean,
    includeRetweets: boolean
}
export class TwitterApiWrapper {
  private client: TwitterApiReadOnly
  constructor(private bearerToken: string, private far?: number) {
    const t = new TwitterApi(bearerToken);
    this.client = t.readOnly;
  }
  async getTweets(userId: string, options?: Options, nextToken?: string) {
    const excluded = convertIncludeToExclude(options);
    const user = await this.client.v2.userByUsername(userId);
    const id = user.data.id;
    // this function returns the user's post history
    const tweets = await this.client.v2.userTimeline(id, {
            max_results: this.far ?? 5, // use pagination
            exclude: excluded,
            pagination_token: nextToken
        });
    if (tweets.data.meta.result_count < 1) {
        throw Error(`No tweets found using the options: ${options} ${tweets.errors}`)
    }
    return tweets.data;
  }
  async getCurrentTweet(userId: string, options?: Options) {
    const tw = await this.getTweets(userId, options);
    if (tw.meta.result_count < 1)
        throw Error(`No tweets found using the options: ${options}`)
    return tw.data.at(0)
  }
  getBearerToken() {
    return this.bearerToken;
  }
}

function convertIncludeToExclude(option?: { includeReplies: boolean, includeRetweets: boolean }) {
  const included: ("replies" | "retweets")[] = ["replies", "retweets"];
  if (option) {
    const { includeReplies, includeRetweets } = option;
    if (includeReplies) included.splice(0, 1);
    if (includeRetweets) included.splice(1, 1);
  }
  return included;
}