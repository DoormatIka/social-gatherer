import { YouTubeChannel } from "./lib/yt";
import { TwitterUser } from "./lib/twitter";
import { TwitchUser, TokenManager } from "./lib/twitch";
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