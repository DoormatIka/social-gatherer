// this file is to store "Memory" to hard drive and get it from hard drive on start up
import { JsonDB, Config } from "node-json-db"
// handles offline functionality
// and missed tweets or posts
export class ExternalStorage<T> {
    private buffer: T[] = []
    constructor() {}
    get(): T[]  {
        return this.buffer;
    }
    set(element: T[]): void {
        this.buffer = element
    }
    add(element: T): void {
        this.buffer.push(element);
    }
}
