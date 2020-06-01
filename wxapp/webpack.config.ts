import * as globby from 'fast-glob';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin = require('terser-webpack-plugin');
import OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import * as path from 'path';
import { pickBy, identity } from 'lodash';
import { Environment } from './env/env';

const srcDir = path.resolve('src');

const loadEnv = (env: string): Environment => {
    const { environment } = require(`./env/${env}.env.ts`);
    return environment;
}

const fileLoader = (ext = '[ext]', esModule = false) => {
    return {
        loader: 'file-loader',
        options: {
            esModule,
            useRelativePath: false,
            name: `[path][name].${ext}`,
            context: srcDir
        }
    }
}

const getEntries = (root: string, patterns: string[]) => {
    let fileList = globby.sync(patterns)
    return fileList.reduce((value, current) => {
        let filePath = path.parse(path.relative(root, current));
        let entry = path.join(filePath.dir, filePath.name);
        value[entry] || (value[entry] = []);
        value[entry].push(path.resolve(__dirname, current));
        return value;
    }, {});
}

export default (env: string) => {
    const isDev = env !== 'prod';
    const environment: Environment = loadEnv(env);
    return {
        entry: pickBy({
            ...getEntries('./src', ['./src/*']),
            ...getEntries('./src', ['./src/pages/**']),
            ...getEntries("./src", ['./src/components/**']),
            mock: environment.localMock ? globby.sync(['./src/mock/**']) : undefined
        }, identity),
        output: {
            filename: '[name].js',
            publicPath: '/',
            path: path.resolve('dist'),
            globalObject: 'global'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include: /src/,
                    exclude: /node_modules/,
                    use: [
                        'babel-loader',
                        'eslint-loader',
                        'source-map-loader'
                    ].filter(Boolean)
                },
                {
                    test: /\.(ts|tsx)$/,
                    include: /src/,
                    exclude: /node_modules/,
                    use: [
                        'ts-loader',
                        'eslint-loader',
                        'source-map-loader'
                    ]
                },
                {
                    test: /\.wxs$/,
                    include: /src/,
                    exclude: /node_modules/,
                    use: [
                        fileLoader(),
                        'babel-loader',
                        'eslint-loader'
                    ]
                },
                {
                    test: /\.(less)$/,
                    include: /src/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'less-loader'
                    ]
                },
                {
                    test: /\.(scss)$/,
                    include: /src/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require('sass'),
                                sassOptions: {
                                    fiber: false,
                                    includePaths: [path.resolve('src', 'styles'), srcDir]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif$)$/,
                    include: /src/,
                    type: 'javascript/auto',
                    use: [
                        fileLoader()
                    ]
                },
                {
                    test: /\.wxml$/,
                    include: /src/,
                    use: [
                        fileLoader('wxml'),
                        {
                            loader: 'wxml-loader',
                            options: {
                                root: srcDir,
                                enforceRelativePath: true,
                                minimize: !isDev
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({ filename: `[name].wxss` }),
            new webpack.DefinePlugin({
                'process.env': JSON.stringify(environment)
            }),
            new webpack.BannerPlugin({
                raw: true,
                banner: `try {` +
                    (environment.localMock ? `require('./mock');` : '') +
                    `require('./runtime');` +
                    `require('./vendors');` +
                    `require('./scripts');` +
                    `} catch (e) {}`,
                include: 'app.js',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'assets', to: 'assets', context: srcDir },
                    {
                        from: '**/*.json', context: srcDir, transform(content) {
                            return isDev ? content : JSON.stringify(JSON.parse(content));
                        }
                    }
                ]
            })
        ],
        optimization: {
            runtimeChunk: { name: 'runtime' },
            minimize: true,
            minimizer: [
                !isDev && new TerserPlugin({
                    test: /\.js(\?.*)?$/i,
                    extractComments: false
                }),
                !isDev && new OptimizeCSSAssetsPlugin({
                    assetNameRegExp: /\.(css|wxss)$/g
                })
            ].filter(Boolean),
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    scripts: {
                        test: /[\\/]src[\\/](core|protocol)[\\/]/,
                        name: 'scripts',
                        chunks: 'all',
                        enforce: true,
                    },
                }
            }
        },
        devtool: isDev ? 'source-map' : false,
        resolve: {
            alias: {
                '@': path.resolve('src')
            },
            modules: [path.resolve(__dirname, 'src'), 'node_modules'],
            extensions: ['.ts', '.js']
        },
        watchOptions: {
            poll: 1000,
            ignored: /dist|node_modules/,
            aggregateTimeout: 300
        },
        stats: 'minimal'
    };
}
