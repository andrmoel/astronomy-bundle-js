import {clearCachedCalculation, getAsyncCachedCalculation, getCachedCalculation} from './calculationCache';

const calculationFunction = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

it('tests getCachedCalculation', () => {
    getCachedCalculation('cacheKey_test1', 1, calculationFunction);
    getCachedCalculation('cacheKey_test1', 1, calculationFunction);
    getCachedCalculation('cacheKey_test1', 1, calculationFunction);
    getCachedCalculation('cacheKey_test1', 1, calculationFunction);

    expect(calculationFunction).toHaveBeenCalledTimes(1);
});

it('tests getAsyncCachedCalculation', async () => {
    await getAsyncCachedCalculation('cacheKey_test2', 1, calculationFunction);
    await getAsyncCachedCalculation('cacheKey_test2', 1, calculationFunction);
    await getAsyncCachedCalculation('cacheKey_test2', 1, calculationFunction);
    await getAsyncCachedCalculation('cacheKey_test2', 1, calculationFunction);

    expect(calculationFunction).toHaveBeenCalledTimes(1);
});

it('tests clearCachedCalculation', () => {
    getCachedCalculation('cacheKey_test3', 1, calculationFunction);
    getCachedCalculation('cacheKey_test3', 1, calculationFunction);
    clearCachedCalculation('cacheKey_test3', 1);
    getCachedCalculation('cacheKey_test3', 1, calculationFunction);
    getCachedCalculation('cacheKey_test3', 1, calculationFunction);

    expect(calculationFunction).toHaveBeenCalledTimes(2);
});
