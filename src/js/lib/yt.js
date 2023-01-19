"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeChannel = void 0;
const yt_channel_info_1 = __importDefault(require("yt-channel-info"));
const events_1 = __importDefault(require("events"));
const subscriberMilestones = [];
let subBase = 1000;
for (let i = 1; i < 10; i++) {
    subscriberMilestones.push(subBase);
    if (i % 2)
        subBase *= 5;
    else
        subBase *= 2;
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
class YouTubeChannel {
    constructor(channelID, msRefresh) {
        this.channelID = channelID;
        this.msRefresh = msRefresh;
        // debug variables
        this.subCount = 0;
        this.innateMemory = {
            channelID: this.channelID,
            previousVideoID: "",
            milestones: {
                prev: null,
                next: null
            }
        };
    }
    /**
     * validates the channelID
     * @returns true/false value to indicate if it's valid or not
     * @beta
     */
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield yt_channel_info_1.default.getChannelInfo({
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
    getVideoListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const e = makeEvent();
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                // mocked for testing
                const data = yield this.getVideos();
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
    recordSubscriberMilestones() {
        return __awaiter(this, void 0, void 0, function* () {
            const e = makeEvent();
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const subscriberCount = yield this.getSubscriberCount();
                const { prev, next } = getMilestoneFromSubscriberCount(subscriberMilestones, subscriberCount);
                // if milestones is null
                if (!this.innateMemory.milestones.prev || !this.innateMemory.milestones.next) {
                    this.innateMemory.milestones.prev = prev;
                    this.innateMemory.milestones.next = next;
                    return;
                }
                // the next milestone gets hit
                if (this.innateMemory.milestones.next <= subscriberCount) {
                    e.emit("subscribeMilestone", this.innateMemory.milestones.next, subscriberCount);
                    this.innateMemory.milestones.prev = prev;
                    this.innateMemory.milestones.next = next;
                }
            }), this.msRefresh);
            return e;
        });
    }
    getVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            const vids = yield yt_channel_info_1.default.getChannelVideos({
                sortBy: "newest",
                channelId: this.channelID,
            });
            return vids;
        });
    }
    getSubscriberCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield yt_channel_info_1.default.getChannelInfo({
                channelId: this.channelID,
            });
            return stats.subscriberCount;
        });
    }
    // developer functions
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
    mockedGetSubscriberCount(addedSubscribers) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = new Promise((res, rej) => {
                setTimeout(() => {
                    this.subCount += addedSubscribers + 598;
                    console.log(this.subCount);
                    res(this.subCount);
                }, 500);
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
}
exports.YouTubeChannel = YouTubeChannel;
function getMilestoneFromSubscriberCount(subMilestones, subCount) {
    let milestones = {
        prev: 0,
        next: 0
    };
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
    return new events_1.default();
}
