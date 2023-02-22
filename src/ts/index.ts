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

async function main() {
    const db = new Cache();
    const tw = new TwitterUser("LilynHana", "???", 95000);
    const tw2 = new TwitterUser("lfnsdlkf", "?????", 50000);
    const tw3 = new TwitterUser("fksjdbfds", "??", 10000);
    const a  = new YouTubeChannel("Lilyn", 50000);

    await db.push(tw, tw2, tw3);
    await db.push(a);
}
main()