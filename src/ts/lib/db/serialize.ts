import { YoutubeSerializer } from "../yt";
import { TwitterSerializer } from "../twitter";

export class Serialize {
    private youtubeSerializer: YoutubeSerializer = new YoutubeSerializer();
    private twitterSerializer: TwitterSerializer = new TwitterSerializer();

    youtube(data: Array<any>) {
        return this.youtubeSerializer.convertObject(data);
    }
    twitter(data: Array<any>) {
        return this.twitterSerializer.convertObject(data);
    }
}