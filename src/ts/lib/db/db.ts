import { JsonDB, Config } from "node-json-db";
import { YouTubeChannel, YoutubeJSON } from "../yt";
import { TwitterJSON, TwitterUser } from "../twitter";
import { Factory } from "./factory";
import { Serialize } from "./serialize";
import { ManagerFactory, TokenManager, TwitchJSON, TwitchUser } from "../twitch";


export class Cache {
    private db: JsonDB;
    private factory: Factory = new Factory();
    private serialize: Serialize = new Serialize();

    constructor(filename?: string) {
        this.db = new JsonDB(new Config(filename ?? "data", true, false, "/"))
    }
    async get(path: "youtube" | "twitter" | "twitch") {
        if (!await this.db.exists(`/${path}`)) return;
        return this.factory.convertJSON(path, await this.db.getData(`/${path}`));
    }
    async getTokenManager() {
        if (!await this.db.exists(`/manager`)) return;
        return this.factory.convertSingularJSON("manager", await this.db.getData(`/manager`));
    }
    
    async pushYoutube(...data: YouTubeChannel[]) {
        const yt = this.serialize.youtube(data);
        if (yt.length != 0) await this.db.push("/youtube", await this.filterYoutube(yt));
    }
    async pushTwitter(...data: TwitterUser[]) {
        const tw = this.serialize.twitter(data);
        if (tw.length != 0) await this.db.push("/twitter", await this.filterTwitter(tw));
    }
    async pushTwitch(...data: TwitchUser[]) {
        const tw = this.serialize.twitch(data);
        if (tw.length != 0) await this.db.push("/twitch", await this.filterTwitch(tw));
    }
    async pushManager(data: TokenManager) {
        await this.db.push("/manager", this.serialize.manager(data))
    }

    // duplicate removers (i really want to do inheritance to avoid these duplicates.)
    private async filterTwitter(data: TwitterJSON[]) {
        if (!await this.db.exists("/twitter")) return data;
        const tw = await this.db.getObject<Array<TwitterJSON>>("/twitter");
        const ids = new Set(tw.map(c => c.userId));
        return [...tw, data.filter(d => !ids.has(d.userId))];
    }
    private async filterYoutube(data: YoutubeJSON[]) {
        if (!await this.db.exists("/youtube")) return data;
        const yt = await this.db.getObject<Array<YoutubeJSON>>("/youtube");
        const ids = new Set(yt.map(c => c.channelID));
        return [...yt, data.filter(d => !ids.has(d.channelID))];
    }
    private async filterTwitch(data: TwitchJSON[]) {
        if (!await this.db.exists("/twitch")) return data;
        const tc = await this.db.getObject<Array<TwitchJSON>>("/twitch");
        const ids = new Set(tc.map(c => c.username));
        return [...tc, data.filter(d => !ids.has(d.username))];
    }
}