import { RawSourceMap } from 'source-map';
import { getOptions } from 'loader-utils';
import * as webpack from 'webpack';

export default function loader(this: webpack.loader.LoaderContext, source: string | Buffer, _sourceMap?: RawSourceMap): string | Buffer | void | undefined {
    const { minify } = getOptions(this);
    return minify ? JSON.stringify(JSON.parse(source.toString())) : source;
}
