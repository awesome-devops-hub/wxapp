import * as globby from 'fast-glob';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin = require('terser-webpack-plugin');
import OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import { resolve, relative, parse, join, dirname } from 'path';
import { pickBy, identity, startsWith, find } from 'lodash';
import { existsSync, readFileSync } from 'fs';
import Terser from 'terser';

const srcDir = resolve('src');
const distDir = resolve('dist');

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
        let filePath = parse(relative(root, current));
        let entry = join(filePath.dir, filePath.name);
        value[entry] || (value[entry] = []);
        value[entry].push(resolve(__dirname, current));
        return value;
    }, {});
}

const getWxsList = (entries: string[]): string[] => {
    const getEntryWxsList = (file: string, wxsList: string[]) => {
        const ext = file.split('.').pop();
        const text = readFileSync(file, "utf8");
        const regex = ext === 'wxml' ? /src[\s=]+['"](.+?\.wxs)['"]/g : /require[\s('"]+(.+?\.wxs)[\s)'"]+/g;
        do {
            const match = regex.exec(text);
            if (!match) {
                break;
            }
            const path = resolve(dirname(file), match[1]);
            if (!find(wxsList, e => e === path)) {
                wxsList.push(path);
                getEntryWxsList(path, wxsList);
            }
        } while (true);
    }

    const wxsList: string[] = [];
    entries.forEach(entry => getEntryWxsList(resolve(srcDir, entry + '.wxml'), wxsList));
    return wxsList.map(e => relative(srcDir, e));
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
    const wxsList = getWxsList([...pages, ...components]);
    const jsonFiles = ['app', ...pages, ...components]
        .map(e => e + '.json')
        .filter(e => existsSync(resolve(srcDir, e)));

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
                        fileLoader()
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
                                    includePaths: [resolve('src', 'styles'), srcDir]
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
                        fileLoader(),
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
                    ...jsonFiles.map(e => ({
                        from: resolve(srcDir, e),
                        to: resolve(distDir, e),
                        transform: content => isDev ? content : JSON.stringify(JSON.parse(content))
                    })),
                    ...wxsList.map(e => ({
                        from: resolve(srcDir, e),
                        to: resolve(distDir, e),
                        transform: content => isDev ? content : Terser.minify(content.toString()).code
                    }))
                ]
            })
        ],
        optimization: {
            runtimeChunk: { name: 'runtime' },
            minimize: true,
            minimizer: [
                !isDev && new TerserPlugin({
                    test: /\.(js(\?.*)?|wxs)$/i,
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
                    },
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
