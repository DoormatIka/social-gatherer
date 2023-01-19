export declare const server: ServerData;
export type ServerData = {
    serverID: string;
    channels: {
        id: string;
        data: {
            previousVideoID: string;
        };
    }[];
}[];
