const request = require('request-promise');
const { dummyDeps } = require('./dummyDeps');




const loadDependencies = function (pkgName, pkgVersion) {
    return new Promise((resolve, reject) => {
        const dependencies = dummyDeps.filter(pkg => {
            return pkg.name === pkgName;
        });
        if (dependencies) {
            setTimeout(() => {
                resolve({ data: dependencies[0] ? dependencies[0].dependencies : {} });
            }, 10)
        } else {
            reject({ error: 'package not found.' });
        }
    });
};

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