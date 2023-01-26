import { YouTubeChannel, YoutubeJSON } from "../yt"

// J is JSON type
// O is Object type
class Group<J, O> {
    // using Generics and initializing a class with it
    constructor(private object: new () => O) {}
    JSONToObject() {
        new this.object();
    }
}

function objectMaker<O, T, K>(
    object: new (
        innateMemory: T, 
        parameters: K) => O,
    memory: T, parameters: K
) {
    return new object(memory, parameters)
}
class User<T, K> {
    constructor(
        protected innateMemory: T,
        public parameters: K
    ) {} 
    setInnateMemory(memory: T) {}
}

class Youtube<T, K> extends User<T, K> {
    constructor(innateMemory: T, parameters: K) {
        super(innateMemory, parameters);
    }
    setInnateMemory() {}
}

const user = new Youtube<string, string>("memory", "parameter");
console.log( objectMaker<Youtube<string, string>, string, string>(Youtube<string, string>, "memory", "parameter") )
