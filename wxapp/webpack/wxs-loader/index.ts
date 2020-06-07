import { RawSourceMap } from 'source-map';
import { getOptions, urlToRequest } from 'loader-utils';
import * as webpack from 'webpack';
import * as Terser from 'terser';

export default function loader(this: webpack.loader.LoaderContext, source: string | Buffer, sourceMap?: RawSourceMap): string | Buffer | void | undefined {
    const options = getOptions(this) || {};
    let text = source.toString();

    const loadModule = (request) => {
        return new Promise((resolve, reject) => {
            this.addDependency(request);
            this.loadModule(request, (err, src) => err ? reject(err) : resolve(src));
        })
    };

    const callback = this.async();
    const regex = /require[\s('"]+(.+?\.wxs)[\s)'"]+/g;
    const promises = [];
    do {
        const match = regex.exec(text);
        if (!match) {
            break;
        }
        const request = urlToRequest(match[1]);
        promises.push(loadModule(request));
    } while (true);
    Promise.all(promises).then(() => {
        if (options.minify) {
            text = Terser.minify(text, {
                compress: {
                    join_vars: false,
                    conditionals: false
                }
            }).code.replace(/void 0/g, 'undefined');
        }
        callback(null, text, sourceMap);
    });
}
