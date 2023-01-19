import { YouTubeChannel } from "./lib/yt.js";
import { TwitterUser } from "./lib/twitter.js";
import { bearerToken } from "../../secrets/api.json"

async function main() {
    const penguinz0 = new YouTubeChannel("penguinz0", 3000);
    const lilyn     = new TwitterUser(
        bearerToken, "LilynHana", 2000 
    );

    const twit_listen = await lilyn.getTweetListener();
    twit_listen.on("tweeted", (text, sensitive) => {
        console.log(`Lilyn just tweeted: ${text}`)
    }) // checks the twitter account every 2000 ms (pretty low tbh)
}

main().then(() => {});

export const Wrapper = {
    YouTubeChannel,
    TwitterUser
}