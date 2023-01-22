import axios from "axios";
// import { twitch_clientID, twitch_clientSecret } from "../../../secrets/api.json"
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"

type Auth = {
    access_token: string,
    expires_in: string,
    token_type: string,
}

type TwitchStreamsResponse = {
    data: {
        id: string,
        user_id: string,
        user_login: string,
        user_name: string,
        game_id: string,
        game_name: string,
        type: string,
        title: string,
        viewer_count: number,
        started_at: string,
        language: string,
        thumbnail_url: string,
        tag_ids: Array<string>,
        tags: Array<string>,
        is_mature: boolean
    }[],
    pagination: { cursor: string }
}

type TwitchEvents = {
    live: (user_login: string, title: string, viewer_count: number, thumbnail_url: string) => void
}
/**
 * Twitch class to interact with the Twitch API
 * @param clientID - can be found in Twitch API
 * @param bearerToken - from class TokenManager
 * @param msRefresh - time interval (ms) to refresh the API for updates
 * @param username - name of the channel you're tracking
 * 
 * Recommended msRefresh - 15000ms / 15s
 */
export class TwitchUser {
    private event: TypedEmitter<TwitchEvents>
    constructor(
        public clientID: string,
        public username: string,
        public bearerToken: string | undefined,
        public msRefresh: number
    ) {
        this.event = new EventEmitter() as TypedEmitter<TwitchEvents>
    }

    async getStreamListener() {
        setInterval(async () => {
            const channelInfo = await this.getStream();
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

    private async getStream() {
        const params = new URLSearchParams();
        params.append("user_login", this.username);
        const response = await axios.get("https://api.twitch.tv/helix/streams", {
            params: params,
            headers: {
                "Authorization": `Bearer ${this.bearerToken}`,
                "Client-Id"    : this.clientID
            }
        })
        const res: TwitchStreamsResponse = response.data;
        return res.data;
    }
}
/**
 * Handles the refreshing of Twitch. Should be used with `TwitchUser`.
 * @param clientID - from Twitch API
 * @param clientSecret - from Twitch API
 */
export class TokenManager {
    private bearerToken: string | undefined
    constructor(
        public clientID: string,
        public clientSecret: string
    ) {}
    /**
     * Get your bearerToken.
     * @returns a bearerToken to use with TwitchUser
     */
    public getBearerToken() {
        return this.bearerToken;
    }
    /**
     * **Should only be called once.**
     * It runs a function to refresh your Token every hour.
     */
    public async refreshToken() {
        // adds the bearerToken before refreshing it
        const auth = await this.getAuth(this.clientID, this.clientSecret);
        this.bearerToken = auth.access_token;

        setInterval(async () => {
            const auth = await this.getAuth(this.clientID, this.clientSecret);
            this.bearerToken = auth.access_token;
        }, 5000000) // how do you pass the refreshTime that getAuth returns into setInterval?
    }

    private async getAuth(clientId: string, clientSecret: string): Promise<Auth> {
        const auth = await axios.post(
            "https://id.twitch.tv/oauth2/token",
            new URLSearchParams({
                "client_id":     clientId,
                "client_secret": clientSecret,
                "grant_type":    "client_credentials"
            }))
        return auth.data;
    }
}
