const request = require('request-promise');
const NPM_URL = 'https://registry.npmjs.org/'

async function loadDependencies(name, version) {
    if(!name || !version)
        throw Error('invalid params')

    // var opts = {
    //     uri: `https://registry.npmjs.org/${name}/${version}`,
    //     method: 'GET',
    //     json: true,
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // }
    try {

        const deps = await request(`${NPM_URL}${name}/${version}`)
        const { dependencies } = JSON.parse(deps)
        return { data: dependencies }
    } catch( error ) {
        return { error }
    }
}

async function loadTreeRecursively(pkgName, pkgVersion, cachedPkgs = {}) {
    // avoid re-loading
    if (cachedPkgs[pkgName])
        return

    // load root deps
    const deps = await loadDependencies(pkgName, pkgVersion)
    const freshDeps = (deps && deps.data) ? deps.data : {}

    // cache the root
    cachedPkgs[pkgName] = {
        name: pkgName,
        version: pkgVersion,
        dependencies: freshDeps
    }

    // outer join new deps w cached(which pkgs not cached - so need to load)
    const pkgsToLoad = Object.keys(freshDeps).filter(pkgName => !(pkgName in cachedPkgs))

    for( pkgName of pkgsToLoad){
        let pkgVersion = freshDeps[pkgName];
        // fixme - ignore version operators
        pkgVersion = pkgVersion
            .replace('~', '')
            .replace('^', '')
            .replace('<', '')
            .replace('>', '')
            .replace('=', '')
        console.log(`before await [${pkgName}:${pkgVersion}]`)
        await loadTreeRecursively(pkgName, pkgVersion, cachedPkgs)
        console.log(`after await [${pkgName}:${pkgVersion}]`)
    }
}

module.exports = {
    loadDependencies,
    loadTreeRecursively
}