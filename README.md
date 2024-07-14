# f-cache-memory

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
```

## 初始化参数

|参数|默认值|用途|
|----|----|----|
| `size` | `100` | 最多缓存多少个 |
| `expiration` | `Number.MAX_SAFE_INTEGER` | 按时间缓存，超出时间会默认删除 |

## api

|名称|参数|返回值类型|用途|
|----|----|----|----|
| `hasCache` | `key: string` | `boolean` | 验证是否在缓存中 |
| `setCache` | `key: string, data: any` | - | 设置缓存 |
| `getCache` | `key: string` | `any` | 获取缓存 |
| `deleteCache` | `key: string` | - | 删除缓存 |
| `deleteCacheByStarts` | `url: string` | - | 根据键值的前缀删除缓存 |
| `clearCache` | - | - | 清空缓存 |
| `cacheSize` | - | `number` | 有多少个缓存 |
| `getNowCache` | - | `any` | 获取当前缓存，默认为最后一个，`getPreviousCache`/`getNextCache`/`goPostionCache`/`goAbsPostionCache`都会影响当前缓存的值 |
| `getPreviousCache` | - | `any` | 按设置顺序前一个缓存 |
| `getNextCache` | - | `any` | 按设置顺序后一个缓存 |
| `goPostionCache` | `num: number` | `any` | 相对当前缓存获取缓存，1为后一个，-1为前一个 |
| `goAbsPostionCache` | `num: number` | `any` | 按照设置顺序获取第 `num` 个缓存 |
| `getCacheToArray` | - | `[string, any][]` | 按设置顺序转换为数组 |
