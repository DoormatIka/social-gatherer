import YTCH from "yt-channel-info";
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type YouTubeEvents = {
    newUpload: (info: string) => void,
    subscribeMilestone: (milestone: number, subscriberCount: number) => void
}
export type YoutubeMemory = {
    channelID: string,
    previousVideoID: string,
    milestones: {
        prev: number | null,
        next: number | null
    }
}
const subscriberMilestones: number[] = []
let subBase = 1000;
for (let i = 1; i < 13; i++) {
    subscriberMilestones.push(subBase);
    if (i % 2) subBase *= 5; else subBase *= 2;
} // up to 500,000,000

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
    constructor(
        public channelID: string,
        public msRefresh: number,
    ) {
        this.innateMemory = { 
            channelID: this.channelID, 
            previousVideoID: "",
            milestones: {
                prev: null,
                next: null
            }
        };
        if (msRefresh < 10000) {
            console.log(`[WARN] {YouTubeChannel}: msRefresh (${msRefresh}ms) is under 10000ms / 10s.`)
        }
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
    async getVideoListener() {
        const e = makeEvent()
        setInterval(async () => {
            // mocked for testing
            const data = await this.getVideos();
            const items = data.items.length;
            if (items > 0) {
                const recentVideo = data.items[0];
                if (this.innateMemory.previousVideoID.length == 0) {
                    this.innateMemory.previousVideoID = recentVideo.videoId;
                }

                if (this.innateMemory.previousVideoID !== recentVideo.videoId) {
                    this.innateMemory.previousVideoID = recentVideo.videoId;
                    e.emit("newUpload", recentVideo.videoId);
                }
            }
        }, this.msRefresh);
        return e;
    }
    /**
     * repeatedly checks if you hit a subscriber milestone 
     * SHOULD ONLY BE CALLED ONCE
     * @returns - an EventEmitter. Use it to run `event.on()`
     * @example
     * ```js
     * // .. created YoutubeChannel object ..
     * const subscribe = await channel.recordSubscriberMilestones();
     * subscribe.on("subscribeMilestone", (milestone, subscribeCount) => {
     *     // do things with the variables here
     * }
     * ```
     */
    async recordSubscriberMilestones() {
        const e = makeEvent();
        setInterval(async () => {
            const subscriberCount = await this.getSubscriberCount();
            const { prev, next } = getMilestoneFromSubscriberCount(subscriberMilestones, subscriberCount);

            // if milestones is null
            if (!this.innateMemory.milestones.prev || !this.innateMemory.milestones.next) {
                this.innateMemory.milestones.prev = prev
                this.innateMemory.milestones.next = next
                return;
            }

            // the next milestone gets hit
            if (this.innateMemory.milestones.next <= subscriberCount) {
                e.emit("subscribeMilestone", this.innateMemory.milestones.next, subscriberCount);
                this.innateMemory.milestones.prev = prev
                this.innateMemory.milestones.next = next
            }
        }, this.msRefresh);
        return e;
    }

    private async getVideos() {
        const vids = await YTCH.getChannelVideos({
            sortBy: "newest",
            channelId: this.channelID,
        })
        return vids; 
    }

    private async getSubscriberCount() {
        const stats = await YTCH.getChannelInfo({
            channelId: this.channelID,
        })
        return stats.subscriberCount;
    }

    private async getVideoBufferedListener() {
        // bufferedListeners go in the wrapper class
        // When the bot powers down
        // TODO: private for now
    } 
}

function getMilestoneFromSubscriberCount(subMilestones: number[], subCount: number) {
    let milestones = {
        prev: 0,
        next: 0
    }
    for (const milestone of subMilestones) {
        if (subCount > milestone) {
            milestones.prev = milestone;
        }
        if (subCount < milestone) {
            milestones.next = milestone;
            break;
        }
    }
    return milestones;
}

function makeEvent() {
    return new EventEmitter() as TypedEmitter<YouTubeEvents>
}
