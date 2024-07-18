export default class CacheMemory {
    #private;
    constructor(size?: number, expiration?: number, change?: (data: [string, any][]) => void);
    initCache(data: [string, any][]): void;
    hasCache(key: string): boolean;
    setCache(key: string, data: any, expiration?: number): void;
    getCache(key: string): any;
    deleteCache(key: string): void;
    deleteCacheByStarts(url: string): void;
    clearCache(): void;
    cacheSize(): number;
    getNowCache(): any;
    getPreviousCache(): any;
    getNextCache(): any;
    goPostionCache(num: number): any;
    goAbsPostionCache(num: number): any;
    getCacheToArray(needTime: boolean): [string, any][];
}
