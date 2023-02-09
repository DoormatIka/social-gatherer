import { YouTubeChannel, YoutubeSerializer } from "../socials/yt/yt";
import { TwitterSerializer, TwitterUser } from "../socials/twitter/twitter";
import { TwitchSerializer, TwitchUser } from "../socials/twitch/twitch";
import { ManagerSerializer, TokenManager } from "../socials/twitch/tokenmanager";

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
