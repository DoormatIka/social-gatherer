import { YouTubeChannel } from "./lib/yt";
import { TwitterUser } from "./lib/twitter";
import { TwitchUser, TokenManager } from "./lib/twitch";
import { twitterAdapter } from "./lib/adapters/twitter";
import { DatabaseManager } from "./lib/db/db";
// REMOVE THIS TO AVOID EXPOSING API.JSON
// import api from "../../secrets/api.json"
const social_gatherer = {
    YouTubeChannel,
    TwitterUser,
    TwitchUser,
    TokenManager,

    twitterAdapter,
    DatabaseManager
}

export {
    social_gatherer as default,
    YouTubeChannel,
    TwitterUser,
    TwitchUser,
    TokenManager,

    twitterAdapter,
    DatabaseManager
}