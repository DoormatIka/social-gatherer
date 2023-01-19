import TypedEmitter from "typed-emitter";
type YouTubeEvents = {
    newUpload: (info: string) => void;
    subscribeMilestone: () => void;
};
export type Memory = {
    channelID: string;
    previousVideoID: string;
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
    constructor(channelID: string, msRefresh: number);
    /**
     * validates the channelID
     * @returns true/false value to indicate if it's valid or not
     * @beta
     */
    validate(): Promise<boolean>;
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
    getVideoListener(isMocked: boolean): Promise<TypedEmitter<YouTubeEvents>>;
    private getVideos;
    private mockedGetVideos;
    private getVideoBufferedListener;
    private recordSubscriberMilestones;
}
export {};
