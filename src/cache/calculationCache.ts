const cache: {[index: string]: any} = {};

export function getCachedCalculation(cacheKey: string, time: number, func: Function): any {
    cacheKey = _getGeneratedCacheKey(cacheKey, time);

    if (cache.hasOwnProperty(cacheKey)) {
        return cache[cacheKey];
    }

    cache[cacheKey] = func();

    return cache[cacheKey];
}

export async function getAsyncCachedCalculation(cacheKey: string, time: number, func: Function): Promise<any> {
    cacheKey = _getGeneratedCacheKey(cacheKey, time);

    if (cache.hasOwnProperty(cacheKey)) {
        return cache[cacheKey];
    }

    cache[cacheKey] = await func();

    return cache[cacheKey];
}

export function clearCachedCalculation(cacheKey: string, time: number): void {
    cacheKey = _getGeneratedCacheKey(cacheKey, time);

    if (cache.hasOwnProperty(cacheKey)) {
        delete cache[cacheKey];
    }
}

function _getGeneratedCacheKey(cacheKey: string, time: number): string {
    return `${cacheKey}_${time};`
}
