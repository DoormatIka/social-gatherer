import { TwitchFactory } from "../socials/twitch/twitch";
import { TwitterFactory } from "../socials/twitter/twitter";
import { YoutubeFactory } from "../socials/yt/yt";
import { ManagerFactory } from "../socials/twitch/tokenmanager";
import { TwitterScraperFactory } from "../socials/twitter/scraper";

export class Factory { 
    // coupler, how do you get rid of this?
    // it's prolly a proxy tho
    private twitter = new TwitterFactory();
    private youtube = new YoutubeFactory();
    private twitch = new TwitchFactory();
    private tokenManager = new ManagerFactory();
    private twitscraper = new TwitterScraperFactory();

    convertJSON(type: "twitter" | "youtube" | "twitch" | "twitscrape", json: Array<any>) {
        if (type === "youtube")
            return this.youtube.convertJSON(json)
        if (type === "twitter") 
            return this.twitter.convertJSON(json)
        if (type === "twitch")
            return this.twitch.convertJSON(json)
        if (type === "twitscrape")
            return this.twitscraper.convertJSON(json)
    }
    convertSingularJSON(type: "manager", json: any) {
        return this.tokenManager.convertJSON(json);
    }
}
