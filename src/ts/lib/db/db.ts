import { JsonDB, Config } from "node-json-db";
import { YouTubeChannel, YoutubeJSON } from "../socials/yt/yt";
import { TwitterJSON, TwitterUser } from "../socials/twitter/twitter";
import { User, UserJSON } from "../socials/base";
import { Factory } from "./factory";
import { TwitchJSON, TwitchUser } from "../socials/twitch/twitch";
import { TokenManager } from "../socials/twitch/tokenmanager";
import { TwitterScraperJSON, TwitterUserScraper } from "../socials/twitter/scraper";

export class Cache {
    private db: JsonDB;
    private factory: Factory = new Factory();

    constructor(filename?: string) {
        this.db = new JsonDB(new Config(filename ?? "data", true, false, "/"))
    }
    async get(path: "youtube" | "twitter" | "twitch" | "twitscrape") {
        if (!await this.db.exists(`/${path}`)) return;
        return this.factory.convertJSON(path, await this.db.getData(`/${path}`));
    }
    // no don't, use [implement] to abstract the userId, channelID, and path (db) variables away.
    // https://youtube.com/watch?v=hxGOiiR9ZKg&feature=shares&t=445
    // abstracted push & filter methods

    // not (YT | TW)[] because of issues on where it will be located in the DB
    async push(...data: YouTubeChannel[] | TwitterUser[] | TwitterUserScraper[] | TwitchUser[]) {
        const path = data[0].getPath();
        await this.db.push(path, await this.filter(data.map(c => c.getJSON()), path))
    }
    private async filter(data: (YoutubeJSON | TwitterJSON | TwitterScraperJSON | TwitchJSON)[], path: string) {
        if (!await this.db.exists(path))
            return data;
        
        const tw = await this.db.getObject<Array<UserJSON>>(path); // magic typing
        const ids = new Set(tw.map(c => c.userId));
        return [...tw, ...data.filter(c => !ids.has(c.userId))];
    }
}
