import { YouTubeChannel } from "./socials/yt/yt";
import { TwitterUser } from "./socials/twitter/twitter";
import { TwitterUserScraper } from "./socials/twitter/scraper";
import { TwitchUser } from "./socials/twitch/twitch";
import { TokenManager } from "./socials/twitch/tokenmanager";

type AllUsers = TwitterUser | TwitchUser | YouTubeChannel | TwitterUserScraper | TokenManager | undefined
export function isYoutube(json: AllUsers): json is YouTubeChannel {
    if (!json) return false;
    return (json as YouTubeChannel).enableVideoEvent !== undefined
}
export function isTwitter(json: AllUsers): json is TwitterUser {
    if (!json) return false;
    return (json as TwitterUser).enableTweetEvent !== undefined
}
export function isTwitch(json: AllUsers): json is TwitchUser {
    if (!json) return false;
    return (json as TwitchUser).enableStreamListener !== undefined
}
export function isTwitterScraper(json: AllUsers): json is TwitterUserScraper {
    if (!json) return false;
    return (json as TwitterUserScraper).getEnableEventEmitter !== undefined
}
export function isManager(json: TokenManager) {
    if (!json) return false;
    return (json as TokenManager).refreshToken !== undefined
}
