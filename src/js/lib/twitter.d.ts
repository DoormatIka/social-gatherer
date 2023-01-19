import TypedEmitter from "typed-emitter";
type TwitEvents = {
    tweeted: (text: string, sensitive?: boolean) => void;
};
/**
 * Twitter class to interact with the Twitter API
 * @param bearerToken - the bearer token found in the developer website
 * @param userId - the username found here: https://twitter.com/[userId]
 * @param msRefresh - how many times it will update the API (with getTweetListener)
 *
 * Recommended msRefresh: 10000ms / 10s
 */
export declare class TwitterUser {
    userId: string;
    msRefresh: number;
    private client;
    private innateMemory;
    constructor(bearerToken: string, userId: string, msRefresh: number);
    /**
     * listens to events that happens in Twitter accounts every msRefresh
     * @returns - An EventEmitter
     */
    getTweetListener(): Promise<TypedEmitter<TwitEvents>>;
    private getUserTweets;
}
export {};
