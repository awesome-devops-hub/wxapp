import { RawSourceMap } from 'source-map';
import { getOptions, urlToRequest } from 'loader-utils';
import * as webpack from 'webpack';
import { relative } from "path";

export default function loader(this: webpack.loader.LoaderContext, source: string | Buffer, _sourceMap?: RawSourceMap): string | Buffer | void | undefined {
    const options = getOptions(this) || {};

    const text = source.toString();
    const assets: string[] = [];
    const { tabBar } = JSON.parse(text);
    if (tabBar) {
        tabBar.list && tabBar.list.forEach(e => assets.push(e.iconPath, e.selectedIconPath));
    }
    assets.forEach(e => {
        const request = urlToRequest(relative(this.rootContext, e));
        this.addDependency(request);
        this.loadModule(request, err => {
            if (err) {
                throw err;
            }
        });
    })

    return options.minify ? JSON.stringify(JSON.parse(source.toString())) : source;
}
