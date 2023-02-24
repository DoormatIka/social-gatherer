import { JsonDB, Config } from "node-json-db";
import { YouTubeChannel, YoutubeJSON } from "../socials/yt/yt";
import { TwitterJSON, TwitterUser } from "../socials/twitter/twitter";
import { User, UserJSON } from "../socials/base";
import { Factory } from "./factory";
import { TwitchJSON, TwitchUser } from "../socials/twitch/twitch";
import { TokenManager } from "../socials/twitch/tokenmanager";

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
    async getTokenManager() {
        if (!await this.db.exists(`/manager`)) return;
        return this.factory.convertSingularJSON("manager", await this.db.getData(`/manager`));
    }
    // no don't, use [implement] to abstract the userId, channelID, and path (db) variables away.
    // https://youtube.com/watch?v=hxGOiiR9ZKg&feature=shares&t=445
    // abstracted push & filter methods

    // not (YT | TW)[] because of issues on where it will be located in the DB
    async push(...data: YouTubeChannel[] | TwitterUser[]) {
        const path = data[0].getPath();
        await this.db.push(path, await this.filter(data.map(c => c.getJSON()), path))
    }
    private async filter(data: (YoutubeJSON | TwitterJSON)[], path: string) {
        if (!await this.db.exists(path))
            return data;
        
        const tw = await this.db.getObject<Array<UserJSON>>(path); // magic typing
        const ids = new Set(tw.map(c => c.userId));
        return [...tw, ...data.filter(c => !ids.has(c.userId))];
    }

    // legacy code
    // raw push & filter methods (bit modified because of interfaces in the class themselves)
    async pushYoutube(...data: YouTubeChannel[]) {
        // data: 
        const yt = data.map(c => c.getJSON())
        if (yt.length != 0) 
            await this.db.push("/youtube", await this.filterYoutube(yt));
    }
    async pushTwitter(...data: TwitterUser[]) {
        const tw = data.map(c => c.getJSON())
        if (tw.length != 0) 
            await this.db.push(data[0].getPath(), await this.filterTwitter(tw));
    }
    async pushTwitch(...data: TwitchUser[]) {
        const tw = data.map(c => c.getJSON())
        if (tw.length != 0) 
            await this.db.push("/twitch", await this.filterTwitch(tw));
    }
    async pushManager(data: TokenManager) {
        await this.db.push("/manager", data.getJSON())
    }
    private async filterTwitter(data: TwitterJSON[]) {
        if (!await this.db.exists("/twitter")) return data;
        const tw = await this.db.getObject<Array<TwitterJSON>>("/twitter");
        const ids = new Set(tw.map(c => c.userId));
        return [...tw, data.filter(d => !ids.has(d.userId))];
    }
    private async filterYoutube(data: YoutubeJSON[]) {
        if (!await this.db.exists("/youtube")) return data;
        const yt = await this.db.getObject<Array<YoutubeJSON>>("/youtube");
        const ids = new Set(yt.map(c => c.userId));
        return [...yt, data.filter(d => !ids.has(d.userId))];
    }
    private async filterTwitch(data: TwitchJSON[]) {
        if (!await this.db.exists("/twitch")) return data;
        const tc = await this.db.getObject<Array<TwitchJSON>>("/twitch");
        const ids = new Set(tc.map(c => c.userId));
        return [...tc, data.filter(d => !ids.has(d.userId))];
    }
}
