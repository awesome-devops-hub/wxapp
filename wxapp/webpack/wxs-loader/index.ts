import { RawSourceMap } from 'source-map';
import { getOptions, urlToRequest } from 'loader-utils';
import * as webpack from 'webpack';
import * as Terser from 'terser';

export default function loader(this: webpack.loader.LoaderContext, source: string | Buffer, _sourceMap?: RawSourceMap): string | Buffer | void | undefined {
    const options = getOptions(this);
    let text = source.toString();

    const regex = /require[\s('"]+(.+?\.wxs)[\s)'"]+/g;
    do {
        const match = regex.exec(text);
        if (!match) {
            break;
        }
        const request = urlToRequest(match[1]);
        this.loadModule(request, err => {
            if (err) {
                throw err;
            }
        });
    } while (true);

    if (options.minify) {
        text = Terser.minify(text, {
            compress: {
                join_vars: false,
                conditionals: false
            }
        }).code.replace(/void 0/g, 'undefined');
    }
    return text;
}
