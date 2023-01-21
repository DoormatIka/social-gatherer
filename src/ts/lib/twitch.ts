import axios from "axios";
import { twitch_clientID, twitch_clientSecret } from "../../../secrets/api.json"

type Auth = {
    access_token: string,
    expires_in: string,
    token_type: string,
}

async function main() {
    const auth = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        new URLSearchParams({
            "client_id":     twitch_clientID,
            "client_secret": twitch_clientSecret,
            "grant_type":    "client_credentials"
        }))
    const data: Auth = auth.data
    
    const params = new URLSearchParams();
    params.append("user_login", "lilyn_h");
    const response = await axios.get("https://api.twitch.tv/helix/streams", {
        params: params,
        headers: {
            "Authorization": `Bearer ${data.access_token}`,
            "Client-Id"    : twitch_clientID
        }
    })

    console.log(response.data)
}
main();
