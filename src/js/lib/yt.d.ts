import TypedEmitter from "typed-emitter";
type YouTubeEvents = {
    newUpload: (info: string) => void;
    subscribeMilestone: (milestone: number, subscriberCount: number) => void;
};
export type YoutubeMemory = {
    channelID: string;
    previousVideoID: string;
    milestones: {
        prev: number | null;
        next: number | null;
    };
};
/**
 * makes a YouTube class to use for events
 * @param channelID - possible options:
 *   - user = 'penguinz0'
 *   - jumbled = 'UCXuqSBlHAE6Xw-yeJA0Tunw'
 * @param msRefresh - how many ms to refresh the YoutubeChannel. 3 minutes (180 000ms) is recommended.
 * @param memory - an array to store the YoutubeChannels
 *
 */
export declare class YouTubeChannel {
    channelID: string;
    msRefresh: number;
    private innateMemory;
    private subCount;
    constructor(channelID: string, msRefresh: number);
    /**
     * validates the channelID
     * @returns true/false value to indicate if it's valid or not
     * @beta
     */
    validate(): Promise<boolean>;
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
    getVideoListener(): Promise<TypedEmitter<YouTubeEvents>>;
    recordSubscriberMilestones(): Promise<TypedEmitter<YouTubeEvents>>;
    private getVideos;
    private getSubscriberCount;
    private mockedGetVideos;
    private mockedGetSubscriberCount;
    private getVideoBufferedListener;
}
export {};
