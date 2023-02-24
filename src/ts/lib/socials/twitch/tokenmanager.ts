import axios from "axios";

type Auth = {
  access_token: string,
  expires_in: string,
  token_type: string,
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
    // TODO: fix this functioon, it's not getting the token.
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
