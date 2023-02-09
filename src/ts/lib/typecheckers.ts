import { YouTubeChannel } from "./socials/yt/yt";
import { TwitterUser } from "./socials/twitter/twitter";
import { TwitchUser } from "./socials/twitch/twitch";
import { TokenManager } from "./socials/twitch/tokenmanager";

type AllUsers = TwitterUser[] | TwitchUser[] | YouTubeChannel[] | TokenManager | undefined
export function isYoutube(json: AllUsers): json is YouTubeChannel[] {
    if (!json) return false;
    if (!Array.isArray(json)) return false;
    return (json[0] as YouTubeChannel).enableVideoEvent !== undefined
}
export function isTwitter(json: AllUsers): json is TwitterUser[] {
    if (!json) return false;
    if (!Array.isArray(json)) return false;
    return (json[0] as TwitterUser).enableTweetEvent !== undefined
}
export function isTwitch(json: AllUsers): json is TwitchUser[] {
    if (!json) return false;
    if (!Array.isArray(json)) return false;
    return (json[0] as TwitchUser).enableStreamListener !== undefined
}
export function isManager(json: TokenManager) {
    if (!json) return false;
    return (json as TokenManager).refreshToken !== undefined
}
