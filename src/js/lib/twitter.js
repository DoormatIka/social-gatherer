"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterUser = void 0;
const twitter_api_v2_1 = require("twitter-api-v2");
const events_1 = __importDefault(require("events"));
/**
 * Twitter class to interact with the Twitter API
 * @param bearerToken - the bearer token found in the developer website
 * @param userId - the username found here: https://twitter.com/[userId]
 * @param msRefresh - how many times it will update the API (with getTweetListener)
 *
 * Recommended msRefresh: 10000ms / 10s
 */
class TwitterUser {
    constructor(bearerToken, userId, msRefresh) {
        this.userId = userId;
        this.msRefresh = msRefresh;
        const t = new twitter_api_v2_1.TwitterApi(bearerToken);
        this.client = t.readOnly;
        this.innateMemory = { tweet_id: "" };
    }
    /**
     * listens to events that happens in Twitter accounts every msRefresh
     * @returns - An EventEmitter
     */
    getTweetListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const e = makeEvent();
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const tweets = yield this.getUserTweets();
                const currentTweet = tweets.data.at(0);
                if (!currentTweet)
                    return;
                // if there's no tweetId's saved in memory
                if (this.innateMemory.tweet_id.length === 0) {
                    this.innateMemory.tweet_id = currentTweet.id;
                    return;
                }
                // if memory tweetId is not equal to current tweetId
                if (this.innateMemory.tweet_id !== currentTweet.id) {
                    e.emit("tweeted", currentTweet.text, currentTweet.possibly_sensitive);
                    this.innateMemory.tweet_id = currentTweet.id;
                }
            }), this.msRefresh);
            return e;
        });
    }
    getUserTweets() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (yield this.client.v2.userByUsername(this.userId)).data.id;
            const tweets = yield this.client.v2.userTimeline(id, {
                max_results: 5,
                exclude: ["replies", "retweets"],
            });
            return tweets.data;
        });
    }
}
exports.TwitterUser = TwitterUser;
function makeEvent() {
    return new events_1.default();
}
