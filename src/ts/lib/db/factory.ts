import { TwitterFactory } from "../twitter";
import { YoutubeFactory } from "../yt";


export class Factory {
    private twitter = new TwitterFactory();
    private youtube = new YoutubeFactory();

    convertJSON(type: "twitter" | "youtube", json: Array<any>) {
        if (type === "youtube")
            return this.youtube.convertJSON(json)
        if (type === "twitter") 
            return this.twitter.convertJSON(json)
    }
}