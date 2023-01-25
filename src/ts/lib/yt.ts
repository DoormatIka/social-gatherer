import YTCH from "yt-channel-info";
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type YouTubeEvents = {
    newUpload: (info: string) => void,
}
type YoutubeMemory = {
    previousVideoID: string,
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
    private innateMemory: YoutubeMemory
    private event: TypedEmitter<YouTubeEvents>
    constructor(
        public channelID: string,
        public msRefresh: number,
    ) {
        this.innateMemory = { previousVideoID: "", };
        this.event = new EventEmitter() as TypedEmitter<YouTubeEvents>
        if (msRefresh < 10000) {
            console.log(`[WARN] {YouTubeChannel}: msRefresh (${msRefresh}ms) is under 10000ms / 10s.`)
        }
    }
    setInnateMemory(memory: YoutubeMemory) {
        this.innateMemory = memory
    }
    getEventEmitter() {
        return this.event;
    }
    /**
     * validates the channelID
     * @returns true/false value to indicate if it's valid or not
     * @beta
     */
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
    
   /**
    * repeatedly checks if you uploaded
    * SHOULD ONLY BE CALLED ONCE
    * @returns - an EventEmitter. Use it to run `event.on()`
    * @example
    * ```js
    * // ... made the YouTubeChannel object ...
    *
    * const listener = await channel.getVideoListener();
    * // listen to the newUpload event
    * listener.on("newUpload", payload => console.log(payload));
    * ```
    */
    public async enableVideoEvent() {
        setInterval(async () => {
            const currentVideo = await this.getCurrentVideo();
            if (currentVideo) {
                if (this.innateMemory.previousVideoID.length == 0) {
                    this.innateMemory.previousVideoID = currentVideo.videoId;
                    return;
                }

                if (this.innateMemory.previousVideoID !== currentVideo.videoId) {
                    this.event.emit("newUpload", currentVideo.videoId);
                    this.innateMemory.previousVideoID = currentVideo.videoId;
                }
            }
        }, this.msRefresh);
    }
    public async getDelayedVideos() {
        const currentVideo = await this.getCurrentVideo();
        const data = await this.getVideos();
        return data.items.map(c => {
            return { title: c.title, videoId: c.videoId }
        })
    }

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
}