import { YouTubeChannel, YoutubeJSON } from "../yt"

// lib/adapter.ts
/**
 * Converts JS Objects to Class Objects to be used with a JSON-based database
 * @generic P - Parameter type
 * @generic M - Memory type
 * @generic O - Object type
 */
class Adapter<P, M, O extends User<P, M>> {
    // using Generics and initializing a class with it
    constructor(private object: new (parameters: P) => O) {}
    JSONToObject(...parameters: P[]) {
        const objects: O[] = []
        for (const parameter of parameters) {
            objects.push(new this.object(parameter));
        }
        return objects; 
    }
}
// lib/user.ts
class User<P, M> {
    protected innateMemory?: M;
    constructor(public parameters: P) {}
    /**
     * @type M - swss 
     */
    set memory(memory: M) {
        this.innateMemory = memory
    }
}

// lib/youtube.ts
type YoutubeParameters = {
    username: string
}
type YoutubeMemory = {
    lastVideoRecorded: string
}

class Youtube extends User<YoutubeParameters, YoutubeMemory> {
    constructor(parameters: YoutubeParameters) {
        super(parameters);
    }
}

// main.ts
const lilyn = new Youtube({ username: "lilyn" });
lilyn.memory = { lastVideoRecorded: Math.random().toString(10) }
console.log( lilyn )

