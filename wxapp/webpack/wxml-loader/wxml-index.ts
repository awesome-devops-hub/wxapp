import Minifier from 'html-minifier';
import * as webpack from 'webpack';
import { RawSourceMap } from 'source-map';
import { getOptions } from 'loader-utils';

export default function loader(this: webpack.loader.LoaderContext, source: string | Buffer, _sourceMap?: RawSourceMap): string | Buffer | void | undefined {
    const { minify } = getOptions(this);
    return minify ? Minifier.minify(source, {
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
    }) : source;
}
