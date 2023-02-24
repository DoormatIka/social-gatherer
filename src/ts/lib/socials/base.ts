// compatibility layer for DB
// i know these functions & variables will be used a lot for DB so I'll couple them.
export interface User<JSON, MEMORY> {
    getPath: () => string;
    getJSON: () => JSON;
    setJSON: (memory: MEMORY) => void;
}

export interface UserJSON {
    userId: string
}