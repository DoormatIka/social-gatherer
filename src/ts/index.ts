import { YouTubeChannel } from "./lib/socials/yt/yt";
import { TwitterUser } from "./lib/socials/twitter/twitter";
import { TwitterUserScraper } from "./lib/socials/twitter/scraper";
import { TwitchUser } from "./lib/socials/twitch/twitch";
import { TokenManager } from "./lib/socials/twitch/tokenmanager";
import { Cache } from "./lib/db/db";
import { isYoutube, isTwitter, isTwitch, isManager, isTwitterScraper } from "./lib/typecheckers";

const social_gatherer = {
    YouTubeChannel,
    TwitterUser,
    TwitterUserScraper,
    TwitchUser,
    TokenManager,
    Cache,

    isYoutube, isTwitter, isTwitch, isManager, isTwitterScraper
}
export {
    social_gatherer as default,
    YouTubeChannel,
    TwitterUser,
    TwitterUserScraper,
    TwitchUser,
    TokenManager,
    Cache,

    isYoutube, isTwitter, isTwitch, isManager, isTwitterScraper
}

async function main() {
    const db = new Cache();

    const v = await db.get("twitscrape");
    console.log("Getting from DB")
    v?.forEach(async c => {
        if (isTwitterScraper(c)) {
            const e = await c.getEnableEventEmitter();
            e?.on("tweet", (e) => console.log(e))
        }
    })
    console.log("Started")

    const tw = new TwitterUserScraper("LilynHana", 30000, 100000);
    await tw.init(true);

    const harizzment = await tw.getEnableEventEmitter();
    harizzment?.on("tweet", (a) => console.log(a));

    db.push(tw);
}
main()