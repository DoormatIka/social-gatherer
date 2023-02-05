import { ManagerFactory, TwitchFactory } from "../twitch";
import { TwitterFactory } from "../socials/twitter/twitter";
import { YoutubeFactory } from "../yt";


export class Factory {
    private twitter = new TwitterFactory();
    private youtube = new YoutubeFactory();
    private twitch = new TwitchFactory();
    private tokenManager = new ManagerFactory();

    convertJSON(type: "twitter" | "youtube" | "twitch", json: Array<any>) {
        if (type === "youtube")
            return this.youtube.convertJSON(json)
        if (type === "twitter") 
            return this.twitter.convertJSON(json)
        if (type === "twitch")
            return this.twitch.convertJSON(json)
    }
    convertSingularJSON(type: "manager", json: any) {
        return this.tokenManager.convertJSON(json);
    }
}