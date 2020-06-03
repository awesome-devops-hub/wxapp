import { resolve, isAbsolute, relative, dirname, join } from 'path';
import sax from 'sax';
import { Script } from 'vm';
import Minifier from 'html-minifier';
import { isUrlRequest, urlToRequest, getOptions } from 'loader-utils';
import { startsWith } from 'lodash';
import * as webpack from 'webpack';
import { RawSourceMap } from 'source-map';

const extract = (src, __webpack_public_path__) => {
    const script = new Script(src, { displayErrors: true });
    const sandbox = {
        __webpack_public_path__,
        module: {},
    } as any;
    script.runInNewContext(sandbox);
    return sandbox.module.exports.toString();
};

function getPublicPath(options, context) {
    const property = 'publicPath';
    if (property in options) {
        return options[property];
    }
    if (
        context.options &&
        context.options.output &&
        property in context.options.output
    ) {
        return context.options.output[property];
    }
    if (
        context._compilation &&
        context._compilation.outputOptions &&
        property in context._compilation.outputOptions
    ) {
        return context._compilation.outputOptions[property];
    }
    return '';
}

const defaultMinimizeConf = {
    caseSensitive: true,
    html5: true,
    removeComments: true,
    removeCommentsFromCDATA: true,
    removeCDATASectionsFromCDATA: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    keepClosingSlash: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
};

export default function loader(this: webpack.loader.LoaderContext, source: string | Buffer, _sourceMap?: RawSourceMap): string | Buffer | void | undefined {

    let content = source.toString();
    const callback = this.async();
    const { _module: { issuer }, resourcePath, context } = this;

    const issuerContext = (issuer && issuer.context) || this;

    const options = getOptions(this) || {};
    const {
        root = resolve(context, issuerContext),
        publicPath = getPublicPath(options, this),
        enforceRelativePath = false,
        minimize: forceMinimize,
        ...minimizeOptions
    } = options;

    const requests = [];
    const hasMinimizeConfig = typeof forceMinimize === 'boolean';
    const shouldMinimize = hasMinimizeConfig ? forceMinimize : this.minimize;

    const loadModule = (request) => {
        return new Promise((resolve, reject) => {
            this.addDependency(request);
            this.loadModule(request, (err, src) => err ? reject(err) : resolve(src));
        })
    };

    const ensureStartsWithDot = (source) => startsWith(source, '.') ? source : `./${source}`;

    const ensureRelativePath = (source) => {
        const sourcePath = join(root, source);
        const resourceDirname = dirname(resourcePath);
        source = relative(resourceDirname, sourcePath).replace(/\\/g, '/');
        return ensureStartsWithDot(source);
    };

    const replaceRequest = async ({ request, startIndex, endIndex }) => {
        const module = await loadModule(request);
        let source = extract(module, publicPath);
        const isSourceAbsolute = isAbsolute(source);
        if (!isSourceAbsolute && !/^(\w+:)?\/\//.test(source)) {
            source = ensureStartsWithDot(source);
        }
        if (enforceRelativePath && isSourceAbsolute) {
            source = ensureRelativePath(source);
        }
        content = content.slice(0, startIndex) + source + content.slice(endIndex);
    };

    const parser = sax.parser(false, { lowercase: true });

    parser.onattribute = ({ name, value }) => {
        if (!value || name != 'src' || /{{/.test(value) || !isUrlRequest(value, root)) {
            return;
        }

        const endIndex = parser.position - 1;
        const startIndex = endIndex - value.length;
        const request = urlToRequest(value, root);

        requests.unshift({ request, startIndex, endIndex });
    };

    parser.onend = async () => {
        try {
            for (const request of requests) {
                await replaceRequest(request);
            }

            if (shouldMinimize) {
                content = Minifier.minify(content, {
                    ...defaultMinimizeConf,
                    ...minimizeOptions,
                });
            }
            callback(null, content);
        } catch (err) {
            callback(err, content);
        }
    };

    parser.write(content).close();
    return undefined;
}
