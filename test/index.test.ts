import { expect, test, describe } from 'vitest'
import CacheMemory from '../lib/main'

async function sleep (timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  })
}

describe('setCache', async () => {
  test(`setCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    expect(Cache.getCacheToArray()).toEqual([['aaa', 111]])
  })
  test(`setCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111)
    await sleep(100)
    expect(Cache.getCacheToArray()).toEqual([])
  })
  test(`setCache width expiration change`, async () => {
    let cacheList: [string, any][] = []
    const Cache = new CacheMemory(100, 100, (data) => {
      cacheList = data
    })
    Cache.setCache('aaa', 111)
    await sleep(100)
    Cache.setCache('bbb', 222)
    expect(cacheList).toEqual([['bbb', { dateTime: cacheList[0][1].dateTime, data: 222 }]])
  })
})

describe('hasCache', async () => {
  test(`hasCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    expect(Cache.hasCache('aaa')).toBe(true)
  })
  test(`hasCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111)
    await sleep(100)
    expect(Cache.hasCache('aaa')).toBe(false)
  })
  test(`hasCache width expiration change`, async () => {
    let cacheList: [string, any][] = []
    const Cache = new CacheMemory(100, 100, (data) => {
      cacheList = data
    })
    Cache.setCache('aaa', 111)
    await sleep(100)
    Cache.setCache('bbb', 222)
    expect(cacheList).toEqual([['bbb', { dateTime: cacheList[0][1].dateTime, data: 222 }]])
  })
})

describe('getCache', async () => {
  test(`getCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    expect(Cache.getCache('aaa')).toBe(111)
  })
  test(`getCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111)
    await sleep(100)
    expect(Cache.getCache('aaa')).toBe(undefined)
  })
  test(`getCache width expiration change`, async () => {
    let cacheList: [string, any][] = []
    const Cache = new CacheMemory(100, 100, (data) => {
      cacheList = data
    })
    Cache.setCache('aaa', 111)
    await sleep(100)
    Cache.setCache('bbb', 222)
    expect(cacheList).toEqual([['bbb', { dateTime: cacheList[0][1].dateTime, data: 222 }]])
  })
})

describe('deleteCache', async () => {
  test(`deleteCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.deleteCache('aaa')
    expect(Cache.getCacheToArray()).toEqual([])
  })
  test(`deleteCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    await sleep(100)
    Cache.deleteCache('aaa')
    expect(Cache.getCacheToArray()).toEqual([])
  })
  test(`deleteCache width change`, async () => {
    let cacheList: [string, any][] = []
    const Cache = new CacheMemory(100, 100, (data) => {
      cacheList = data
    })
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    Cache.deleteCache('aaa')
    expect(cacheList).toEqual([['bbb', { dateTime: cacheList[0][1].dateTime, data: 222 }]])
  })
})

describe('deleteCacheByStarts', async () => {
  test(`deleteCacheByStarts`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('/api/students?page=1', { result: [{ name: '小明', age: 10 }] })
    Cache.setCache('/api/students?page=1', { result: [{ name: '小红', age: 11 }] })
    Cache.deleteCacheByStarts('/api/students')
    expect(Cache.getCacheToArray()).toEqual([])
  })
  test(`deleteCacheByStarts width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('/api/students?page=1', { result: [{ name: '小明', age: 10 }] })
    Cache.setCache('/api/students?page=1', { result: [{ name: '小红', age: 11 }] })
    Cache.deleteCacheByStarts('/api/students')
    expect(Cache.getCacheToArray()).toEqual([])
  })
  test(`deleteCacheByStarts width expiration change`, async () => {
    let cacheList: [string, any][] = []
    const Cache = new CacheMemory(100, 100, (data) => {
      cacheList = data
    })
    Cache.setCache('/api/students?page=1', { result: [{ name: '小明', age: 10 }] })
    await sleep(50)
    Cache.deleteCacheByStarts('/api/students')
    Cache.setCache('/api/students?page=1', { result: [{ name: '小红', age: 11 }] })
    expect(cacheList).toEqual([['/api/students?page=1', { dateTime: cacheList[0][1].dateTime, data: { result: [{ name: '小红', age: 11 }] } }]])
  })
})

describe('clearCache', async () => {
  test(`clearCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.clearCache()
    expect(Cache.getCacheToArray()).toEqual([])
  })
  test(`clearCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111)
    Cache.clearCache()
    expect(Cache.getCacheToArray()).toEqual([])
  })
  test(`clearCache width expiration change`, async () => {
    let cacheList: [string, any][] = []
    const Cache = new CacheMemory(100, 100, (data) => {
      cacheList = data
    })
    Cache.setCache('aaa', 111)
    Cache.clearCache()
    expect(cacheList).toEqual([])
  })
})

describe('initCache', async () => {
  test(`initCache`, () => {
    let cacheList: [string, any][] = [['aaa', 111], ['bbb', 222]]
    const Cache = new CacheMemory()
    Cache.initCache(cacheList)
    expect(Cache.getCacheToArray()).toEqual([['aaa', 111], ['bbb', 222]])
  })
  test(`initCache width expiration`, async () => {
    let cacheList: [string, any][] = [['aaa', 111], ['bbb', 222]]
    const Cache = new CacheMemory(100, 100)
    Cache.initCache(cacheList)
    await sleep(100)
    expect(Cache.cacheSize()).toBe(0)
  })
  test(`initCache width expiration change`, async () => {
    let cacheList: [string, any][] = [['aaa', 111], ['bbb', 222]]
    const Cache = new CacheMemory(100, 100, (data) => {
      cacheList = data
    })
    Cache.initCache(cacheList)
    await sleep(100)
    Cache.cacheSize()
    expect(cacheList.length).toBe(0)
  })
})

describe('cacheSize', async () => {
  test(`cacheSize`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    expect(Cache.cacheSize()).toBe(2)
  })
  test(`cacheSize width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111)
    await sleep(100)
    Cache.setCache('bbb', 222)
    expect(Cache.cacheSize()).toBe(1)
  })
  test(`cacheSize width expiration change`, async () => {
    let cacheList: [string, any][] = []
    const Cache = new CacheMemory(100, 100, (data) => {
      cacheList = data
    })
    Cache.setCache('aaa', 111)
    await sleep(100)
    Cache.setCache('bbb', 222)
    expect(cacheList.length).toBe(1)
  })
})

describe('getNowCache', async () => {
  test(`getNowCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    expect(Cache.getNowCache()).toBe(222)
  })
  test(`getNowCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111, 10000)
    Cache.setCache('bbb', 222)
    await sleep(100)
    expect(Cache.getNowCache()).toBe(111)
  })
  test(`getNowCache width expiration change`, async () => {
    let cacheList: [string, any][] = []
    const Cache = new CacheMemory(100, 100, (data) => {
      cacheList = data
    })
    Cache.setCache('aaa', 111, 10000)
    Cache.setCache('bbb', 222)
    await sleep(100)
    expect(Cache.getNowCache()).toBe(111)
    expect(cacheList).toEqual([['aaa', { dateTime: cacheList[0][1].dateTime, data: 111 }]])
  })
})

describe('getPreviousCache', async () => {
  test(`getPreviousCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    expect(Cache.getPreviousCache()).toBe(111)
  })
  test(`getPreviousCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111, 10000)
    Cache.setCache('bbb', 222)
    await sleep(100)
    Cache.setCache('ccc', 333)
    expect(Cache.getPreviousCache()).toBe(111)
  })
})

describe('getNextCache', async () => {
  test(`getNextCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    Cache.setCache('ccc', 333)
    expect(Cache.getNextCache()).toBe(333)
  })
  test(`getNextCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111, 10000)
    Cache.setCache('bbb', 222)
    await sleep(100)
    Cache.setCache('ccc', 333)
    expect(Cache.getPreviousCache()).toBe(111)
    await sleep(100)
    expect(Cache.getNextCache()).toBe(111)
  })
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

describe('goPostionCache', async () => {
  test(`goPostionCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    Cache.setCache('ccc', 333)
    Cache.setCache('ddd', 444)
    expect(Cache.goPostionCache(-2)).toBe(222)
    expect(Cache.getNextCache()).toBe(333)
  })
  test(`goPostionCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111, 10000)
    Cache.setCache('bbb', 222)
    await sleep(100)
    Cache.setCache('ccc', 333)
    expect(Cache.goPostionCache(-1)).toBe(111)
  })
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

describe('goAbsPostionCache', async () => {
  test(`goAbsPostionCache`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    Cache.setCache('ccc', 333)
    Cache.setCache('ddd', 444)
    expect(Cache.goAbsPostionCache(1)).toBe(222)
    expect(Cache.getNextCache()).toBe(333)
  })
  test(`goAbsPostionCache width expiration`, async () => {
    const Cache = new CacheMemory(100, 100)
    Cache.setCache('aaa', 111, 10000)
    Cache.setCache('bbb', 222)
    await sleep(100)
    Cache.setCache('ccc', 333)
    expect(Cache.goAbsPostionCache(1)).toBe(333)
  })
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

describe('goAbsPostionCache', async () => {
  test(`getCacheToArray`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    expect(Cache.getCacheToArray()).toEqual([['aaa', 111], ['bbb', 222]])
  })
  test(`getCacheToArray width needTime`, () => {
    const Cache = new CacheMemory()
    Cache.setCache('aaa', 111)
    Cache.setCache('bbb', 222)
    const cacheList = Cache.getCacheToArray(true)
    expect(cacheList).toEqual([['aaa', { dateTime: cacheList[0][1].dateTime, data: 111 }], ['bbb', { dateTime: cacheList[1][1].dateTime, data: 222 }]])
  })
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

test(`deleteExpirationCache 1000`, async () => {
  const Cache = new CacheMemory(100, 1000)
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222)
  await sleep(500)
  Cache.setCache('ccc', 333)
  await sleep(500)
  Cache.setCache('ddd', 444)
  expect(Cache.getCacheToArray()).toEqual([['ccc', 333], ['ddd', 444]])
})

test(`setCache add expiration`, async () => {
  const Cache = new CacheMemory(100, 1000)
  Cache.setCache('aaa', 111)
  Cache.setCache('bbb', 222, 500)
  await sleep(600)
  Cache.setCache('ccc', 333)
  expect(Cache.getCacheToArray()).toEqual([['aaa', 111], ['ccc', 333]])
})
