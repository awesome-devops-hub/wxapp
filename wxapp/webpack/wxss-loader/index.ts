import { RawSourceMap } from 'source-map';
import * as webpack from 'webpack';

export default function loader(this: webpack.loader.LoaderContext, source: string | Buffer, _sourceMap?: RawSourceMap): string | Buffer | void | undefined {
    console.log(source);
    return source;
}
