# f-cache-memory

[![npm](https://img.shields.io/npm/v/f-cache-memory)](https://www.npmjs.com/package/f-cache-memory) [![Coverage Status](https://coveralls.io/repos/github/fxss5201/f-cache-memory/badge.svg?branch=main)](https://coveralls.io/github/fxss5201/f-cache-memory?branch=main) [![Download](https://img.shields.io/npm/dm/f-cache-memory)](https://www.npmjs.com/package/f-cache-memory)

```sh
npm i f-cache-memory
```

[中文文档](https://github.com/fxss5201/f-cache-memory/blob/main/README-zh_CN.md)

cache memory library

```ts
import CacheMemory from 'f-cache-memory'

const cache = new CacheMemory()
cache.setCache('aaa', 111)
cache.setCache('bbb', 222)
console.log(cache.getCache('aaa'))
console.log(cache.getNowCache())
console.log(cache.getPreviousCache())
cache.setCache('ccc', 333)
console.log(cache.getNowCache())
console.log(cache.getPreviousCache())
console.log(cache.getNextCache())
console.log(cache.getCacheToArray())

const localCache = new CacheMemory(100, 100000, (data) => {
  localStorage.setItem('localCache', JSON.stringify(data))
})
localCache.setCache('aaa', 111)
localCache.setCache('bbb', 222)

const initCache = new CacheMemory()
const localStorageCache = localStorage.getItem('localCache')
if (localStorageCache) {
  initCache.initCache(JSON.parse(localStorageCache))
}
console.log(initCache.getCacheToArray())
```

Vue:

```ts
const cacheList = ref<[string, any][]>([])
const localCache = new CacheMemory(100, 100000, (data) => {
  cacheList.value = data
})
```

React:

```ts
const [cacheList, setCacheList] = useState<[string, any][]>([])
const localCache = new CacheMemory(100, 100000, (data) => {
  setCacheList(data)
})
```

## Initialize parameters

|parameter|default|description|version|
|------|----|------|----|
| `size?: number` | `100` | How many can be cached at most ||
| `expiration?: number` | `Number.MAX_SAFE_INTEGER` | Set the cache validity period in milliseconds, and if it exceeds the time, it will be deleted ||
| `change?: (data: [string, any][]) => void` | - | When the cache changes, external data can be synchronized within this method | `change` in v0.0.7+ |

## api

|api|parameter|typeof return|description|version|
|----|----|----|----|----|
| `initCache` | `data: [string, any][]` | - | Initialize cached data | `initCache` in v0.0.7+ |
| `hasCache` | `key: string` | `boolean` | Verify if it is in cache ||
| `setCache` | `key: string, data: any, expiration?: number` | - | Set cache, `expiration` sets the cache validity period in milliseconds, with priority higher than the initialized `expiration` parameter. If not set, it defaults to the initialized `expiration` parameter | `expiration` in v0.0.3+ |
| `getCache` | `key: string` | `any` | Retrieve cache ||
| `deleteCache` | `key: string` | - | Delete Cache ||
| `deleteCacheByStarts` | `url: string` | - | Delete cache based on the prefix of key values ||
| `clearCache` | - | - | Clear Cache ||
| `cacheSize` | - | `number` | Cache Size ||
| `getNowCache` | - | `any` | Retrieve the current cache, which defaults to the last one, `getPreviousCache`/`getNextCache`/`goPostionCache`/`goAbsPostionCache` will affect the current cached value ||
| `getPreviousCache` | - | `any` | Cache the previous cache in the set order ||
| `getNextCache` | - | `any` | Cache the next cache in the set order ||
| `goPostionCache` | `num: number` | `any` | Retrieve cache relative to the current cache, where 1 is the next and -1 is the previous ||
| `goAbsPostionCache` | `num: number` | `any` | Retrieve the numth cache in the order set ||
| `getCacheToArray` | `needTime: boolean = false` | `[string, any][]` | Convert to an array in the order set. If the parameter is `false`, return the set data directly. If it is `true`, return `{dateTime: expiration time, data: set data}` | `dateTime` parameter in v0.0.7+ |

## Usage scenario

### axios cache

[example](https://github.com/fxss5201/vue-components/blob/main/src/service/httpCache.ts#L2)

```ts
// httpCache.ts
import type { AxiosRequestConfig } from 'axios'
import CacheMemory from 'f-cache-memory'

const httpCache = new CacheMemory()
// const httpCache = new CacheMemory(100, 1000)

export function configToKey(config: AxiosRequestConfig): string {
  let key = config.url as string
  if (config.params) {
    key += JSON.stringify(config.params)
  }
  return key
}

export default httpCache
```

The encapsulation adjustments for `axios` are as follows

```ts
...
import httpCache, { configToKey } from './httpCache'
...
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200 && response.config.method === 'get') {
      const curHttpCacheKey = configToKey(response.config)
      httpCache.setCache(curHttpCacheKey, response)
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
...
export function get<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
  const curHttpCacheKey: string = configToKey({
    url,
    ...config
  })
  if (!httpCache.hasCache(curHttpCacheKey)) {
    const httpRequest = instance.get(url, config)
    httpCache.setCache(curHttpCacheKey, httpRequest)
    return httpRequest as Promise<T>
  } else {
    return Promise.resolve(httpCache.getCache(curHttpCacheKey))
  }
}
```

Firstly, encapsulate the request and check if it is in the cache before sending the `get` request. Set the cache value in the `interceptors.response`.

### Fallback function

In some areas that require rollback functionality, this cache supports various caching operations such as `getNowCache`/`getPreviousCache`/`getNextCache`/`goPostionCache`/`goAbsPostionCache`.
