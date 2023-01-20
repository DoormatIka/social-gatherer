import { YouTubeChannel } from "./lib/yt.js";
import { TwitterUser } from "./lib/twitter.js";
// REMOVE THIS TO AVOID EXPOSING API.JSON
// import api from "../../secrets/api.json"
const social_gatherer = {
    YouTubeChannel,
    TwitterUser
}

export {
    social_gatherer as default,
    YouTubeChannel,
    TwitterUser
}