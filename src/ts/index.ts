import { YouTubeChannel } from "./lib/socials/yt/yt";
import { TwitterUser } from "./lib/socials/twitter/twitter";
import { TwitchUser } from "./lib/socials/twitch/twitch";
import { TokenManager } from "./lib/socials/twitch/tokenmanager";
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
