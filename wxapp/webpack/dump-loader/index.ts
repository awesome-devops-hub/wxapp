import { RawSourceMap } from 'source-map';
import { getOptions, interpolateName } from 'loader-utils';
import * as webpack from 'webpack';
import { posix } from 'path';

export default function (this: webpack.loader.LoaderContext, source: string | Buffer, sourceMap?: RawSourceMap): string | Buffer | void | undefined {
    const options = getOptions(this) || {};
    const context = options.context || this.rootContext;
    const url = interpolateName(
        this,
        options.name || '[name].[ext]',
        {
            context,
            source,
            regExp: options.regExp,
        }
    );

    let outputPath = url;
    if (options.outputPath) {
        if (typeof options.outputPath === 'function') {
            outputPath = options.outputPath(url, this.resourcePath, context);
        } else {
            outputPath = posix.join(options.outputPath, url);
        }
    }

    if (typeof options.emitFile === 'undefined' || options.emitFile) {
        this.emitFile(outputPath, source, sourceMap);
    }
    return options.output !== undefined ? options.output : source;
}
