const deps = [
    {
        name: 'pkg1',
        version: '1.0.0',
        dependencies: {
            'pkg1.1': '1.1'
        }
    },
    {
        name: 'pkg1.1',
        version: '1.1',
        dependencies: {
            'pkg1.1.1': '1.1.1'
        }
    },
    {
        name: 'pkg1.1.1',
        version: '1.1.1',
        dependencies: {}
    },
    {
        name: 'pkg2',
        version: '2.0.0',
        dependencies: {
            'pkg2.1': '2.1.0'
        }
    },
    {
        name: 'pkg2.1',
        version: '2.1.0',
        dependencies: {
            'pkg2.1.1': '2.1.1'
        }
    },
    {
        name: 'pkg2.1.1',
        version: '2.1.1',
        dependencies: {}
    },
]


module.exports = { dummyDeps: deps }