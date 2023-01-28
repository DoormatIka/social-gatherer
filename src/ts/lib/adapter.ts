
// to be used on the Cache/Container
export class Adapter<M, C> {
    constructor(private classType: new (...params: any[]) => C) {}
    convertJsonToClass(memory: M) {}
}

// to be used on the Users
export class Plug<M> {
    constructor() {}
}
// usage:
// function() {
//     return convertToJson(this);
// }
//
// DB <==> Adapter <==> Plug <== Object
