jest.mock('./dependLoader'); // manual mocking of NPM calls
const dl = require('./dependLoader')


describe('NPM Dependency Loading', () => {

    it('Load single level', async () =>  {
        const depOneLevel = await dl.loadDependencies('pkg1', '0')
        expect(depOneLevel).toBeDefined()

        expect(depOneLevel.data).toBeDefined()
        expect(depOneLevel.error).toBeUndefined()
        expect(depOneLevel.data['pkg1.1']).toBe('1.1')
    });

    it('Load whole tree into cache', async () =>  {
        let cache = {}
        await dl.loadTreeRecursively('pkg1', '1.0.0', cache)
        expect(cache).toBeDefined()

        expect(cache.pkg1).toBeDefined()
        expect(cache['pkg1.1'].version).toBe('1.1')
        expect(cache['pkg1.1.1'].version).toBe('1.1.1')

        cache = {}
        await dl.loadTreeRecursively('pkg2', '2.0.0', cache)
        expect(cache).toBeDefined()

        expect(cache.pkg2).toBeDefined()
        expect(cache['pkg2.1'].version).toBe('2.1.0')
        expect(cache['pkg2.1.1'].version).toBe('2.1.1')

    });

});