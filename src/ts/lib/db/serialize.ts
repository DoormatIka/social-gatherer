import { YouTubeChannel, YoutubeSerializer } from "../yt";
import { TwitterSerializer, TwitterUser } from "../twitter";
import { ManagerSerializer, TokenManager, TwitchSerializer, TwitchUser } from "../twitch";

export class Serialize {
    private youtubeSerializer: YoutubeSerializer = new YoutubeSerializer();
    private twitterSerializer: TwitterSerializer = new TwitterSerializer();
    private twitchSerializer : TwitchSerializer  = new TwitchSerializer();
    private managerSerializer: ManagerSerializer = new ManagerSerializer();

    youtube(data: Array<YouTubeChannel>) {
        return this.youtubeSerializer.convertObject(data);
    }
    twitter(data: Array<TwitterUser>) {
        return this.twitterSerializer.convertObject(data);
    }
    twitch(data: Array<TwitchUser>) {
        return this.twitchSerializer.convertObject(data);
    }
    manager(data: TokenManager) {
        return this.managerSerializer.convertObject(data);
    }
}