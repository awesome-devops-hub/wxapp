export function flatten<T>(source: T) {
    const assign = (obj, source): T => {
        if (source === Object.prototype) {
            return obj;
        }
        Object.getOwnPropertyNames(source)
            .forEach(key => {
                const val = source[key];
                key !== 'constructor' && (obj[key] = val);
            });
        const inherited = Object.getPrototypeOf(source);
        return inherited ? assign(obj, inherited) : obj;
    };
    return assign({}, source);
}
