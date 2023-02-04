import YTCH from "yt-channel-info";
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";


type YouTubeEvents = {
    newUpload: (id: string, author: string, title: string, duration: string) => void,
}
type YoutubeMemory = {
    previousVideoID: string,
}
export type YoutubeJSON = {
    channelID: string,
    msRefresh: number,
    memory: YoutubeMemory,
}

/**
 * makes a YouTube class to use for events
 * @param channelID - possible options:
 *   - user = 'penguinz0'
 *   - jumbled = 'UCXuqSBlHAE6Xw-yeJA0Tunw'
 * @param msRefresh - how many ms to refresh the YoutubeChannel. 3 minutes (180 000ms) is recommended.
 * @param memory - an array to store the YoutubeChannels
 *
 */
export class YouTubeChannel {
    private event: TypedEmitter<YouTubeEvents>
    private previousVideoID: string = ""
    constructor(
        private channelID: string,
        private msRefresh: number,
    ) {
        this.event = new EventEmitter() as TypedEmitter<YouTubeEvents>
        if (msRefresh < 10000) {
            console.log(`[WARN] {YouTubeChannel}: msRefresh (${msRefresh}ms) is under 10000ms / 10s.`)
        }
    }
    getEventEmitter() {
        return this.event;
    }
    
    async validate(): Promise<boolean> { 
        try {
            await YTCH.getChannelInfo({
                channelId: this.channelID
            })
            return true;
        } catch (err) {
            return false;
        }
    }
    
    public async enableVideoEvent() {
        setInterval(async () => {
            const currentVideo = await this.getCurrentVideo();
            if (currentVideo) {
                if (this.previousVideoID.length == 0) {
                    this.previousVideoID = currentVideo.videoId;
                    return;
                }

                if (this.previousVideoID !== currentVideo.videoId) {
                    this.event.emit("newUpload", 
                        currentVideo.videoId,
                        currentVideo.author,
                        currentVideo.title,
                        currentVideo.durationText,
                    );
                    this.previousVideoID = currentVideo.videoId;
                }
            }
        }, this.msRefresh);
    }
    public async getDelayedVideos() {
        const currentVideo = await this.getCurrentVideo();
        if (!currentVideo) return;
        if (this.previousVideoID.length == 0) {
            this.previousVideoID = currentVideo.videoId;
            return;
        }
        const vids = await this.getVideos();
        const videos = [...vids.items];
        let continuation = vids.continuation;
        let continuedVids;
        if (!continuation) return;
        while (true) {
            if (!continuation) break;
            continuedVids = await YTCH.getChannelVideosMore({ continuation }); 
             
            const found = continuedVids.items.find(v => v.videoId === this.previousVideoID);
            videos.push(...continuedVids.items);
            if (found) break;
            continuation = continuedVids.continuation
        }

        const latestVid = videos.at(0);
        if (latestVid) {
            this.previousVideoID = latestVid.videoId;
        }
        // workaround for
        // ytch's stupid policy 
        // not exposing types :anger:
        // return videos;

        return videos.map(c => { 
          c.author, 
          c.authorId, 
          c.durationText, 
          c.lengthSeconds, 
          c.liveNow, 
          c.premiere, 
          c.premium, 
          c.publishedText, 
          c.title, 
          c.type, 
          c.videoId, 
          c.videoThumbnails, 
          c.viewCount, 
          c.viewCountText 
        });
    }

    // helper methods
    private async getCurrentVideo() {
        const data = await this.getVideos();
        return data.items.at(0)
    }
    private async getVideos() {
        const vids = await YTCH.getChannelVideos({
            sortBy: "newest",
            channelId: this.channelID,
        })
        return vids;
    }

    ////////// needed methods ///////////
    getJSON(): YoutubeJSON {
        return { 
            channelID: this.channelID,
            msRefresh: this.msRefresh,
            memory: { previousVideoID: this.previousVideoID },
        };
    }
    setJSON(memory: YoutubeMemory) {
        this.previousVideoID = memory.previousVideoID
    }
}

export class YoutubeFactory {
    convertJSON(json: YoutubeJSON[]) {
        const tw: YouTubeChannel[] = [];
        for (const j of json) {
            const init = new YouTubeChannel(j.channelID, j.msRefresh);
            init.setJSON(j.memory)
            tw.push(init);
        }
        return tw;
    }
}

export class YoutubeSerializer {
    convertObject(yt: YouTubeChannel[]) {
        const json: YoutubeJSON[] = [];
        for (const y of yt) {
            json.push(y.getJSON())
        }
        return json;
    }
}
