import { YouTubeChannel } from "./lib/yt";
import { TwitterUser } from "./lib/socials/twitter";
import { TwitchUser, TokenManager } from "./lib/twitch";
import { Cache } from "./lib/db/db";
import { isYoutube, isTwitter, isTwitch, isManager } from "./lib/typecheckers";

const social_gatherer = {
    YouTubeChannel,
    TwitterUser,
    TwitchUser,
    TokenManager,
    Cache,

    isYoutube, isTwitter, isTwitch, isManager
}
export {
    social_gatherer as default,
    YouTubeChannel,
    TwitterUser,
    TwitchUser,
    TokenManager,
    Cache,

    isYoutube, isTwitter, isTwitch, isManager
}
