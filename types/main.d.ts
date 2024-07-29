export interface CacheValueType {
    dateTime: number;
    data: any;
}
export type isArrayNeedTime<T> = T extends true ? [string, CacheValueType][] : [string, any][];
export default class CacheMemory {
    #private;
    constructor(size?: number, expiration?: number, change?: (data: [string, CacheValueType][]) => void);
    hasCache(key: string): boolean;
    setCache(key: string, data: any, expiration?: number): void;
    getCache(key: string): any;
    deleteCache(key: string): void;
    deleteCacheByStarts(url: string): void;
    clearCache(): void;
    initCache(data: [string, CacheValueType][]): void;
    cacheSize(): number;
    getNowCache(): any;
    getPreviousCache(): any;
    getNextCache(): any;
    goPostionCache(num: number): any;
    goAbsPostionCache(num: number): any;
    getCacheToArray<T extends boolean = false>(needTime?: T): isArrayNeedTime<T>;
}
