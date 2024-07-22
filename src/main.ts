import CacheMemory from '../lib/main'

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
  console.log('data', data)
  localStorage.setItem('localCache', JSON.stringify(data))
})
localCache.setCache('aaa', 111)
localCache.setCache('bbb', 222)

const initCache = new CacheMemory()
const localStorageCache = localStorage.getItem('localCache')
if (localStorageCache) {
  console.log('local', JSON.parse(localStorageCache))
  initCache.initCache(JSON.parse(localStorageCache))
}
console.log(initCache.getCacheToArray())
