const path = require('path');
const fs = require('fs');
const Webpack = require('webpack');
const pkg = require('./package.json');

const resolveApp = relativePath => {
    return path.resolve(fs.realpathSync(process.cwd()), relativePath);
};

const packageName = pkg.name;
const mode = 'production';

let outputFile;

if (mode === 'production') {
    outputFile = packageName + '.min.js';
} else {
    outputFile = packageName + '.js';
}

const paths = {
    dist: resolveApp('lib'),
    nodeModules: resolveApp('node_modules'),
    packageJSON: resolveApp('package.json'),
    src: resolveApp('src'),
    tsConfig: resolveApp('tsconfig.json'),
    tsLint: resolveApp('tslint.json'),
};

const config = {
    module: {
        rules: [
            {
                oneOf: [
                    {
                        include: paths.src,
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: true,
                        },
                        test: /\.(js|jsx|mjs)$/
                    },
                    {
                        exclude: paths.nodeModules,
                        include: paths.src,
                        test: /\.(ts|tsx)$/,
                        use: [
                            {
                                loader: require.resolve('ts-loader'),
                                options: {
                                    transpileOnly: true,
                                },
                            },
                        ],
                    },
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.json']
    },
    performance: {
        hints: false,
    },
    entry: {index: './src/index.ts'},
    mode: mode,
    output: {
        path: paths.dist,
        filename: outputFile,
        library: packageName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: "typeof self !== 'undefined' ? self : this"
    },
};

module.exports = config;