interface CacheValueType {
  dateTime: number,
  data: any
}

export default class CacheMemory {
  #cacheMap: Map<string, CacheValueType>
  #expiration: number
  #position: number
  #size: number
  #cacheKeyList: string[]

  constructor(size: number = 100, expiration: number = Number.MAX_SAFE_INTEGER) {
    this.#cacheMap = new Map()
    this.#expiration = expiration
    this.#position = 0
    this.#size = size
    this.#cacheKeyList = []
  }

  hasCache(key: string) {
    const dateTime = new Date().getTime()
    this.#deleteExpirationCache(dateTime)
    if (this.#cacheMap.has(key)) {
      const curCache = this.#cacheMap.get(key)
      return dateTime - (curCache as CacheValueType).dateTime < this.#expiration
    }
    return false
  }

  setCache(key: string, data: any) {
    if (this.#position !== this.#cacheKeyList.length - 1) this.#beforeAddDeleteNextCache()
    if (this.#cacheKeyList.length >= this.#size) this.#beforeAddCheckSize()
    const dateTime = new Date().getTime()
    if (this.hasCache(key)) this.deleteCache(key)
    this.#addCacheKeyList(key)
    this.#cacheMap.set(key, {
      dateTime,
      data
    })
  }

  getCache(key: string) {
    return this.#cacheMap.get(key)?.data
  }

  deleteCache(key: string) {
    this.#delteCacheKeyList(key)
    this.#cacheMap.delete(key)
  }

  deleteCacheByStarts(url: string) {
    for (const key of this.#cacheMap.keys()) {
      if (key.startsWith(url)) {
        this.deleteCache(key)
      }
    }
  }

  clearCache() {
    this.#cacheKeyList = []
    this.#position = 0
    this.#cacheMap.clear()
  }

  cacheSize(): number {
    return this.#cacheMap.size
  }

  getNowCache() {
    return this.#getCacheByIndex(this.#position)
  }

  getPreviousCache() {
    if (this.#position > 0) {
      this.#position -= 1
    }
    return this.#getCacheByIndex(this.#position)
  }

  getNextCache() {
    if (this.#position < this.#cacheKeyList.length - 1) {
      this.#position += 1
    }
    return this.#getCacheByIndex(this.#position)
  }

  goPostionCache (num: number) {
    this.#position += num
    if (this.#position < 0) {
      this.#position = 0
    } else if (this.#position > this.#cacheKeyList.length - 1) {
      this.#position = this.#cacheKeyList.length - 1
    }
    return this.#getCacheByIndex(this.#position)
  }

  goAbsPostionCache (num: number) {
    this.#position = num
    if (this.#position < 0) {
      this.#position = 0
    } else if (this.#position > this.#cacheKeyList.length - 1) {
      this.#position = this.#cacheKeyList.length - 1
    }
    return this.#getCacheByIndex(this.#position)
  }

  getCacheToArray() {
    const array: [string, any][] = []
    for (const [key, value] of this.#cacheMap.entries()) {
      array.push([key, value.data])
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
      if (dateTime - value.dateTime > this.#expiration) {
        this.deleteCache(key)
        this.#delteCacheKeyList(key)
      }
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
