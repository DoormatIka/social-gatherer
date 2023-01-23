import { YouTubeChannel } from "./lib/socials/yt";
import { TwitterUser } from "./lib/socials/twitter";
import { TwitchUser, TokenManager } from "./lib/socials/twitch";
// REMOVE THIS TO AVOID EXPOSING API.JSON
// import api from "../../secrets/api.json"
const social_gatherer = {
    YouTubeChannel,
    TwitterUser,
    TwitchUser,
    TokenManager
}

export {
    social_gatherer as default,
    YouTubeChannel,
    TwitterUser,
    TwitchUser,
    TokenManager
}

