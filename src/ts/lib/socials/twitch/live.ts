import {TwitchAPI} from "./api";
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"

type TwitchEvents = {
    live: (user_login: string, title: string, viewer_count: number, thumbnail_url: string) => void
}

export class TwitchLive {
  private event = new EventEmitter() as TypedEmitter<TwitchEvents>
  constructor(
    private tw: TwitchAPI,
    private msRefresh: number
  ) {}

    getStreamListener() {
        return this.event;
    }
    async enableStreamListener() {
        setInterval(async () => {
            const channelInfo = await this.tw.getStream();
            const streamInfo = channelInfo.at(0);

            // channelInfo is an empty array when it can't find an online stream
            if (!streamInfo) return;

            this.event.emit("live", 
                streamInfo.user_login, 
                streamInfo.title, 
                streamInfo.viewer_count, 
                streamInfo.thumbnail_url
            )
        }, this.msRefresh)
    }
}
