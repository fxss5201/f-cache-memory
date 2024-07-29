export interface CacheValueType {
  dateTime: number,
  data: any
}

export type isArrayNeedTime<T> = T extends true ? [string, CacheValueType][] : [string, any][]

export default class CacheMemory {
  #cacheMap: Map<string, CacheValueType>
  #expiration: number
  #position: number
  #size: number
  #cacheKeyList: string[]
  #change?: (data: [string, any][]) => void

  constructor(size: number = 100, expiration: number = Number.MAX_SAFE_INTEGER, change?: (data: [string, CacheValueType][]) => void) {
    this.#cacheMap = new Map()
    this.#expiration = expiration
    this.#position = 0
    this.#size = size
    this.#cacheKeyList = []
    if (change) this.#change = change
  }

  hasCache(key: string) {
    const dateTime = new Date().getTime()
    this.#deleteExpirationCache(dateTime)
    if (this.#cacheMap.has(key)) {
      const curCache = this.#cacheMap.get(key)
      return dateTime < (curCache as CacheValueType).dateTime
    }
    return false
  }

  setCache(key: string, data: any, expiration?: number) {
    const expirationTime = expiration ?? this.#expiration
    const dateTime = new Date().getTime()
    this.#deleteExpirationCache(dateTime)
    if (this.#position !== this.#cacheKeyList.length - 1) this.#beforeAddDeleteNextCache()
    if (this.#cacheKeyList.length >= this.#size) this.#beforeAddCheckSize()
    if (this.hasCache(key)) this.deleteCache(key)
    this.#addCacheKeyList(key)
    this.#cacheMap.set(key, {
      dateTime: dateTime + expirationTime,
      data
    })
    if (this.#change) {
      this.#change(this.getCacheToArray(true))
    }
  }

  getCache(key: string) {
    this.#deleteExpirationCacheAndChange(new Date().getTime())
    return this.#cacheMap.get(key)?.data
  }

  deleteCache(key: string) {
    this.#deleteExpirationCache(new Date().getTime())
    this.#delteCacheKeyList(key)
    this.#cacheMap.delete(key)
    if (this.#change) {
      this.#change(this.getCacheToArray(true))
    }
  }

  deleteCacheByStarts(url: string) {
    this.#deleteExpirationCache(new Date().getTime())
    for (const key of this.#cacheMap.keys()) {
      if (key.startsWith(url)) {
        this.#delteCacheKeyList(key)
        this.#cacheMap.delete(key)
      }
    }
    if (this.#change) {
      this.#change(this.getCacheToArray(true))
    }
  }

  clearCache() {
    this.#cacheKeyList = []
    this.#position = 0
    this.#cacheMap.clear()
    if (this.#change) {
      this.#change([])
    }
  }

  initCache(data: [string, CacheValueType][]) {
    data.forEach(item => {
      if (!this.hasCache(item[0])) this.setCache(item[0], item[1].data)
    });
  }

  cacheSize(): number {
    this.#deleteExpirationCacheAndChange(new Date().getTime())
    return this.#cacheMap.size
  }

  getNowCache() {
    this.#deleteExpirationCacheAndChange(new Date().getTime())
    return this.#getCacheByIndex(this.#position)
  }

  getPreviousCache() {
    this.#deleteExpirationCacheAndChange(new Date().getTime())
    if (this.#position > 0) {
      this.#position -= 1
    }
    return this.#getCacheByIndex(this.#position)
  }

  getNextCache() {
    this.#deleteExpirationCacheAndChange(new Date().getTime())
    if (this.#position < this.#cacheKeyList.length - 1) {
      this.#position += 1
    }
    return this.#getCacheByIndex(this.#position)
  }

  goPostionCache (num: number) {
    this.#deleteExpirationCacheAndChange(new Date().getTime())
    this.#position += num
    if (this.#position < 0) {
      this.#position = 0
    } else if (this.#position > this.#cacheKeyList.length - 1) {
      this.#position = this.#cacheKeyList.length - 1
    }
    return this.#getCacheByIndex(this.#position)
  }

  goAbsPostionCache (num: number) {
    this.#deleteExpirationCacheAndChange(new Date().getTime())
    this.#position = num
    if (this.#position < 0) {
      this.#position = 0
    } else if (this.#position > this.#cacheKeyList.length - 1) {
      this.#position = this.#cacheKeyList.length - 1
    }
    return this.#getCacheByIndex(this.#position)
  }

  getCacheToArray<T extends boolean = false>(needTime?: T): isArrayNeedTime<T> {
    this.#deleteExpirationCacheAndChange(new Date().getTime())
    return this.#onlyGetCacheToArray<T>(needTime)
  }

  #onlyGetCacheToArray<T extends boolean = false>(needTime?: T): isArrayNeedTime<T> {
    const array: isArrayNeedTime<T> = []
    for (const [key, value] of this.#cacheMap.entries()) {
      array.push([key, needTime ? value : value.data])
    }
    return array
  }

  #beforeAddDeleteNextCache() {
    while (this.#position < this.#cacheKeyList.length - 1) {
      const nextCacheKey = this.#cacheKeyList[this.#position + 1]
      this.deleteCache(nextCacheKey)
    }
  }

  #getCacheByIndex(index: number) {
    const nowCacheKey = this.#cacheKeyList[index]
    return this.getCache(nowCacheKey)
  }

  #deleteExpirationCache(dateTime: number) {
    for (const [key, value] of this.#cacheMap.entries()) {
      if (dateTime > value.dateTime) {
        this.#cacheMap.delete(key)
        this.#delteCacheKeyList(key)
      }
    }
  }

  #deleteExpirationCacheAndChange(dateTime: number) {
    this.#deleteExpirationCache(dateTime)
    if (this.#change) {
      this.#change(this.#onlyGetCacheToArray(true))
    }
  }

  #addCacheKeyList(key: string) {
    this.#cacheKeyList.push(key)
    this.#position = this.#cacheKeyList.length - 1
  }

  #delteCacheKeyList(key: string) {
    const index = this.#cacheKeyList.indexOf(key)
    if (index > -1) {
      this.#cacheKeyList.splice(index, 1)
      this.#position = this.#cacheKeyList.length - 1
    }
  }

  #beforeAddCheckSize() {
    while (this.#cacheKeyList.length >= this.#size) {
      const oneCacheKey = this.#cacheKeyList[0]
      this.deleteCache(oneCacheKey)
    }
  }
}
