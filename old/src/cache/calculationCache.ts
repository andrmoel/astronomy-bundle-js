/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
const cache: { [index: string]: any } = {};

export function getCachedCalculation<R>(
    cacheKey: string,
    time: number,
    callback: () => R,
): R {
    cacheKey = _getGeneratedCacheKey(cacheKey, time);

    if (cache.hasOwnProperty(cacheKey)) {
        return cache[cacheKey];
    }

    cache[cacheKey] = callback();

    return cache[cacheKey];
}

export async function getAsyncCachedCalculation<R>(
    cacheKey: string,
    time: number,
    callback: () => Promise<R>,
): Promise<R> {
    cacheKey = _getGeneratedCacheKey(cacheKey, time);

    if (cache.hasOwnProperty(cacheKey)) {
        return cache[cacheKey];
    }

    cache[cacheKey] = await callback();

    return cache[cacheKey];
}

export function clearCachedCalculation(cacheKey: string, time: number): void {
    cacheKey = _getGeneratedCacheKey(cacheKey, time);

    if (cache.hasOwnProperty(cacheKey)) {
        delete cache[cacheKey];
    }
}

function _getGeneratedCacheKey(cacheKey: string, time: number): string {
    return `${cacheKey}_${time};`;
}
