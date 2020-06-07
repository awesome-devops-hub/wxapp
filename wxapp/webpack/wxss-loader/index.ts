import { RawSourceMap } from 'source-map';
import * as webpack from 'webpack';

export default function loader(this: webpack.loader.LoaderContext, source: string | Buffer, _sourceMap?: RawSourceMap): string | Buffer | void | undefined {
    let text = source.toString();
    return text.replace(/@import[^;]+['"].*src[\\/]styles[\\/]index(\.scss)?['"].*;/gm, '');
}
