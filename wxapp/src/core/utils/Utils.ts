import { WxPage } from '../wx/WxPage';

export function flatten<T>(source: T) {
    const assign = (obj, source): T => {
        if (source === Object.prototype) {
            return obj;
        }
        const inherited = Object.getPrototypeOf(source);
        obj = inherited ? assign(obj, inherited) : obj;
        Object.getOwnPropertyNames(source)
            .forEach(key => {
                const val = source[key];
                if (key !== 'constructor') {
                    if (typeof val === 'function') {
                        obj[key] = val;
                    } else {
                        obj[key] = val;
                    }
                }
            });
        return obj;
    };
    return assign({}, source);
}

export function pagify<T extends WxPage<any>>(source: T) {
    let obj = flatten(source);
    if (obj.onLoad) {
        const onLoad = obj.onLoad;
        obj.onLoad = function (this: T, query: Record<string, string | undefined>) {
            const params = WxPage.pageParams;
            WxPage.pageParams = {};
            if (typeof params === 'object') {
                onLoad.call(this, Object.assign(params || {}, query));
            } else {
                onLoad.call(this, params);
            }
        };
    }
    Page(obj);
}
