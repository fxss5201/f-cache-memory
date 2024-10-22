# f-cache-memory

[![npm](https://img.shields.io/npm/v/f-cache-memory)](https://www.npmjs.com/package/f-cache-memory) [![Coverage Status](https://coveralls.io/repos/github/fxss5201/f-cache-memory/badge.svg?branch=main)](https://coveralls.io/github/fxss5201/f-cache-memory?branch=main) [![Download](https://img.shields.io/npm/dm/f-cache-memory)](https://www.npmjs.com/package/f-cache-memory)

```sh
npm i f-cache-memory
```

缓存库

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

```ts
export interface CacheValueType {
  dateTime: number;
  data: any;
}
```

## 初始化参数

|参数|默认值|描述|版本|
|------|----|------|------|
| `size?: number` | `100` | 最多缓存多少个 ||
| `expiration?: number` | `Number.MAX_SAFE_INTEGER` | 按时间毫秒设置缓存有效期，超出时间会被删除 ||
| `change?: (data: [string, CacheValueType][]) => void` | - | 当缓存变更的时候，可以在此方法内同步外部数据 | 新增于 v0.0.7 |

## api

|名称|参数|返回值类型|描述|版本|
|----|----|----|----|------|
| `initCache` | `data: [string, CacheValueType][]` | - | 初始化缓存数据 | 新增于 v0.0.7 |
| `hasCache` | `key: string` | `boolean` | 验证是否在缓存中 ||
| `setCache` | `key: string, data: any, expiration?: number` | - | 设置缓存，`expiration` 以毫秒为单位设置缓存有效期，优先级高于初始化的 `expiration` 参数，未设置时默认为 初始化的 `expiration` | `expiration` 新增于 v0.0.3 |
| `getCache` | `key: string` | `any` | 获取缓存 ||
| `deleteCache` | `key: string` | - | 删除缓存 ||
| `deleteCacheByStarts` | `url: string` | - | 根据键值的前缀删除缓存 ||
| `clearCache` | - | - | 清空缓存 ||
| `cacheSize` | - | `number` | 有多少个缓存 ||
| `getNowCache` | - | `any` | 获取当前缓存，默认为最后一个，`getPreviousCache`/`getNextCache`/`goPostionCache`/`goAbsPostionCache`都会影响当前缓存的值 ||
| `getPreviousCache` | - | `any` | 按设置顺序前一个缓存 ||
| `getNextCache` | - | `any` | 按设置顺序后一个缓存 ||
| `goPostionCache` | `num: number` | `any` | 相对当前缓存获取缓存，1为后一个，-1为前一个 ||
| `goAbsPostionCache` | `num: number` | `any` | 按照设置顺序获取第 `num` 个缓存 ||
| `getCacheToArray` | `needTime: boolean = false` | `[string, CacheValueType][] \| [string, any][]` | 按设置顺序转换为数组，如果参数为 `false`，则直接返回设置的数据，如果为 `true`，则会返回 `{ dateTime: 过期时间, data: 设置数据 }` | `dateTime` 参数新增于 v0.0.7 |

``` ts
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
```

## 使用场景

### 接口缓存

[例子](https://github.com/fxss5201/vue-components/blob/main/src/service/httpCache.ts#L2)

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

对 `axios` 封装调整如下

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

首先将请求做个封装，在 `get` 请求发送之前就判断是否在缓存内，在返回拦截器 `interceptors.response` 中设置缓存值。

### 回退功能

在某些需要回退功能的内，本缓存支持 `getNowCache`/`getPreviousCache`/`getNextCache`/`goPostionCache`/`goAbsPostionCache` 等多种缓存操作方式。
