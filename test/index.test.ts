import { expect, test } from 'vitest'
import CacheMemory from '../lib/main'

test(`setCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  expect(Cache.getCacheToArray()).toEqual([['aaa', 111]])
})

test(`hasCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  expect(Cache.hasCache('aaa')).toBe(true)
})

test(`getCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  expect(Cache.getCache('aaa')).toBe(111)
})

test(`deleteCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.deleteCache('aaa')
  expect(Cache.getCacheToArray()).toEqual([])
})

test(`deleteCacheByStarts`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('/api/students?page=1', { result: [{ name: '小明', age: 10 }] })
  Cache.setCache('/api/students?page=1', { result: [{ name: '小红', age: 11 }] })
  Cache.deleteCacheByStarts('/api/students')
  expect(Cache.getCacheToArray()).toEqual([])
})

test(`clearCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.clearCache()
  expect(Cache.getCacheToArray()).toEqual([])
})

test(`cacheSize`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  expect(Cache.cacheSize()).toBe(2)
})

test(`getNowCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  expect(Cache.getNowCache()).toBe(222)
})

test(`getPreviousCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  expect(Cache.getPreviousCache()).toBe(111)
})

test(`getNextCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  Cache.setCache('ccc', 333)
  expect(Cache.getNextCache()).toBe(333)
})

test(`getPreviousCache getPreviousCache getNextCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  Cache.setCache('ccc', 333)
  expect(Cache.getPreviousCache()).toBe(222)
  expect(Cache.getPreviousCache()).toBe(111)
  expect(Cache.getNextCache()).toBe(222)
})

test(`goPostionCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  Cache.setCache('ccc', 333)
  Cache.setCache('ddd', 444)
  expect(Cache.goPostionCache(-2)).toBe(222)
  expect(Cache.getNextCache()).toBe(333)
})

test(`goPostionCache -5`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  expect(Cache.goPostionCache(-5)).toBe(111)
})

test(`goPostionCache 5`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  expect(Cache.goPostionCache(5)).toBe(222)
})

test(`goAbsPostionCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  Cache.setCache('ccc', 333)
  Cache.setCache('ddd', 444)
  expect(Cache.goAbsPostionCache(1)).toBe(222)
  expect(Cache.getNextCache()).toBe(333)
})

test(`goAbsPostionCache -5`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  expect(Cache.goAbsPostionCache(-5)).toBe(111)
})

test(`goAbsPostionCache 5`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  expect(Cache.goAbsPostionCache(5)).toBe(222)
})

test(`getCacheToArray`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  expect(Cache.getCacheToArray()).toEqual([['aaa', 111], ['bbb', 222]])
})

test(`beforeAddCheckSize 2`, () => {
  const Cache = new CacheMemory(2)
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  Cache.setCache('ccc', 333)
  expect(Cache.getCacheToArray()).toEqual([['bbb', 222], ['ccc', 333]])
})

test(`beforeAddDeleteNextCache`, () => {
  const Cache = new CacheMemory()
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  Cache.setCache('ccc', 333)
  Cache.goPostionCache(-1)
  Cache.setCache('ddd', 444)
  expect(Cache.getCacheToArray()).toEqual([['aaa', 111], ['bbb', 222], ['ddd', 444]])
})

async function sleep (timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  })
}

test(`deleteExpirationCache 2000`, async () => {
  const Cache = new CacheMemory(100, 2000)
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  await sleep(1000)
  Cache.setCache('ccc', 333)
  await sleep(1000)
  Cache.setCache('ddd', 444)
  expect(Cache.getCacheToArray()).toEqual([['ccc', 333], ['ddd', 444]])
})

test(`setCache add expiration`, async () => {
  const Cache = new CacheMemory(100, 2000)
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222, 800)
  await sleep(1000)
  Cache.setCache('ccc', 333)
  expect(Cache.getCacheToArray()).toEqual([['aaa', 111], ['ccc', 333]])
})
