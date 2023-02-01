import { YouTubeChannel } from "./lib/yt";
import { TwitterUser } from "./lib/twitter";
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

async function main() {
    const db = new Cache("cache");
    const youtube = await db.get("youtube");

    if (isYoutube(youtube)) { // type checking, remove this for vanilla node.js
        youtube.forEach(async v => {
            // enable everything in the cache
            await v.enableVideoEvent();
            v.getEventEmitter()
                .on("newUpload", (id, author, title, duration) => {
                    console.log(`Video ID: ${id}, ${author}, ${title}`);
                })
        })
        db.pushYoutube(youtube)
    }
}
main()
