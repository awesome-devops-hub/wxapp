import * as globby from 'fast-glob';

import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin = require('terser-webpack-plugin');
import OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import { resolve, relative, parse, join, dirname } from 'path';
import { pickBy, identity, startsWith, find } from 'lodash';
import { existsSync } from 'fs';

const srcDir = resolve('src');

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

const dumpLoader = (output?: string) => {
    return {
        loader: resolve(__dirname, 'webpack/dump-loader/index.ts'),
        options: {
            name: `[path][name].[ext]`,
            context: srcDir,
            output: output
        }
    }
}

const getEntries = (root: string, patterns: string[]) => {
    let fileList = globby.sync(patterns)
    return fileList.reduce((value, current) => {
        let filePath = parse(relative(root, current));
        let entry = join(filePath.dir, filePath.name);
        value[entry] || (value[entry] = []);
        value[entry].push(resolve(__dirname, current));
        return value;
    }, {});
}

const getComponents = (entries: string[]): string[] => {
    const getEntryComponents = (entry: string, components: string[]) => {
        const file = resolve(srcDir, entry + '.json');
        const data = existsSync(file) ? require(file) : {};
        if (data.usingComponents) {
            Object.values(data.usingComponents).forEach((e: any) => {
                let nextEntry: string;
                if (startsWith(e, '/components')) {
                    nextEntry = relative(srcDir, resolve(srcDir, '.' + e));
                } else {
                    nextEntry = relative(srcDir, resolve(dirname(file), e));
                }
                if (!find(components, e => e === nextEntry)) {
                    components.push(nextEntry);
                    getEntryComponents(nextEntry, components);
                }
            });
        }
    }

    const components: string[] = [];
    entries.forEach(entry => getEntryComponents(entry, components));
    return components;
}

const getPages = () => {
    const app = require(resolve(srcDir, 'app.json'));
    const { pages = [], subPackages = [] } = app;
    for (const subPackage of subPackages) {
        const pageRoot = subPackage.root;
        for (let page of subPackage.pages) {
            page = pageRoot + page;
            pages.push(page);
        }
    }
    return pages;
}

const toEntryPoints = (entries: string[]) => {
    const obj = {};
    entries.forEach(entry => obj[entry] = globby.sync(resolve(srcDir, entry) + '\.*'));
    return obj;
}

export default (env: string) => {
    const isDev = env !== 'prod';
    const { environment } = require(`./env/${env}.env.ts`);
    const pages = getPages();
    const components = getComponents(pages);

    return {
        entry: pickBy({
            ...getEntries('./src', ['./src/*']),
            ...toEntryPoints(pages),
            ...toEntryPoints(components),
            mock: environment.localMock ? globby.sync(['./src/mock/**']) : undefined
        }, identity),
        output: {
            filename: '[name].js',
            publicPath: '/',
            path: resolve('dist'),
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
                        {
                            loader: resolve(__dirname, 'webpack/wxs-loader/index.ts'),
                            options: { minify: !isDev }
                        }
                    ]
                },
                {
                    test: /\.json$/,
                    include: /src/,
                    use: [
                        dumpLoader(),
                        {
                            loader: resolve(__dirname, 'webpack/wxjson-loader/index.ts'),
                            options: { minify: !isDev }
                        }
                    ]
                },
                {
                    test: /\.less$/,
                    include: /src/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'less-loader'
                    ]
                },
                {
                    test: /\.scss$/,
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
                                    includePaths: [resolve('src', 'styles'), srcDir]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif$)$/,
                    include: /assets/,
                    use: [
                        fileLoader()
                    ]
                },
                {
                    test: /\.wxml$/,
                    include: /src/,
                    use: [
                        fileLoader(),
                        {
                            loader: resolve(__dirname, 'webpack/wxml-loader/index.ts'),
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
            new CleanWebpackPlugin({
                cleanStaleWebpackAssets: false
            }),
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
                        test: /[\\/]src[\\/](core|protocol|components)[\\/].*\.(js|jsx|ts|tsx)$/,
                        name: 'scripts',
                        chunks: 'all',
                        enforce: true,
                    }
                }
            }
        },
        devtool: isDev ? 'source-map' : false,
        resolve: {
            alias: {
                '@': resolve('src')
            },
            modules: [resolve(__dirname, 'src'), 'node_modules'],
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
