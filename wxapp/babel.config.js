module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                loose: true,
                targets: {
                    browsers: "current node"
                }
            }
        ]
    ],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                'helpers': false,
                'regenerator': true
            }
        ]
    ]
}
