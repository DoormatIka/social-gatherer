var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import YTCH from "yt-channel-info";
import EventEmitter from "events";
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
    constructor(channelID, msRefresh) {
        this.channelID = channelID;
        this.msRefresh = msRefresh;
        this.innateMemory = { channelID: this.channelID, previousVideoID: "" };
    }
    /**
     * validates the channelID
     * @returns true/false value to indicate if it's valid or not
     * @beta
     */
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield YTCH.getChannelInfo({
                    channelId: this.channelID
                });
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    /**
     * repeatedly checks if you uploaded
     * @returns - an EventEmitter. Use it to run `event.on()`
     * @example
     * ```js
     * ... made the YouTubeChannel object ...
     *
     * const listener = await channel.getVideoListener();
     * // listen to the newUpload event
     * listener.on("newUpload", payload => console.log(payload));
     * ```
     */
    getVideoListener(isMocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = makeEvent();
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                // mocked for testing
                let data;
                if (isMocked) {
                    data = yield this.mockedGetVideos(2);
                }
                else {
                    data = yield this.getVideos();
                }
                const items = data.items.length;
                if (items > 0) {
                    const recentVideo = data.items[0];
                    if (this.innateMemory.previousVideoID.length == 0 ||
                        this.innateMemory.previousVideoID !== recentVideo.videoId) {
                        this.innateMemory.previousVideoID = recentVideo.videoId;
                        e.emit("newUpload", recentVideo.videoId);
                    }
                }
            }), this.msRefresh);
            return e;
        });
    }
    getVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            const vids = yield YTCH.getChannelVideos({
                sortBy: "newest",
                channelId: this.channelID,
            });
            return vids;
        });
    }
    mockedGetVideos(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            // non-blocking timer
            const p = new Promise((res, rej) => {
                setTimeout(() => {
                    const aigo = { items: [] };
                    aigo.items.push({ videoId: Date.now().toString() });
                    res(aigo);
                }, seconds * 1000);
            });
            return p;
        });
    }
    getVideoBufferedListener() {
        return __awaiter(this, void 0, void 0, function* () {
            // bufferedListeners go in the wrapper class
            // When the bot powers down
            // TODO: private for now
        });
    }
    recordSubscriberMilestones() {
        return __awaiter(this, void 0, void 0, function* () {
            // wwww
            // TODO: private for now
            const e = makeEvent();
            const stats = yield YTCH.getChannelInfo({ channelId: this.channelID });
            setInterval(() => {
                e.emit("subscribeMilestone");
            }, this.msRefresh);
            return e;
        });
    }
}
function makeEvent() {
    return new EventEmitter();
}
function convertTimestampToSeconds(timestamp) {
    // "9 hours ago"
    const splitTimestamp = timestamp
        .split(" ", 2);
    if (!splitTimestamp)
        return;
    const timeMapToSeconds = [
        { name: "second", value: 1 },
        { name: "minute", value: 60 },
        { name: "hour", value: 3600 },
        { name: "day", value: 86400 },
        { name: "week", value: 604800 },
        { name: "month", value: 2628000 },
        { name: "year", value: 31540000 }
    ];
    const timed = {
        num: parseInt(splitTimestamp[0], 10),
        name: splitTimestamp[1],
    };
    for (const time of timeMapToSeconds) {
        if (timed.name.includes(time.name)) {
            return timed.num * time.value;
        }
    }
}
