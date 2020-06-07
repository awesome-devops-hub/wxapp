import { dirname, join, parse, relative, resolve } from 'path';
import { existsSync } from "fs";
import { find, identity, pickBy, startsWith } from 'lodash';
import { Environment } from '../env/env';
import * as globby from 'fast-glob';

export class EntryResolver {
    constructor(private srcDir: string) {
    }

    private getPages(): string[] {
        const app = require(resolve(this.srcDir, 'app.json'));
        const { pages = [], subPackages = [] } = app;
        for (const subPackage of subPackages) {
            const pageRoot = subPackage.root;
            for (let page of subPackage.pages) {
                page = pageRoot + page;
                pages.push(page);
            }
        }
        return pages;
    }

    private getComponents(entries: string[]): string[] {
        const getEntryComponents = (entry: string, components: string[]) => {
            const file = resolve(this.srcDir, entry + '.json');
            const data = existsSync(file) ? require(file) : {};
            if (data.usingComponents) {
                Object.values(data.usingComponents).forEach((e: any) => {
                    let nextEntry: string;
                    if (startsWith(e, '/components')) {
                        nextEntry = relative(this.srcDir, resolve(this.srcDir, '.' + e));
                    } else {
                        nextEntry = relative(this.srcDir, resolve(dirname(file), e));
                    }
                    if (!find(components, e => e === nextEntry)) {
                        components.push(nextEntry);
                        getEntryComponents(nextEntry, components);
                    }
                });
            }
        }

        const components: string[] = [];
        entries.forEach(entry => getEntryComponents(entry, components));
        return components;
    }

    private getEntries(rootDir: string, patterns: string[]) {
        let fileList = globby.sync(patterns)
        return fileList.reduce((value, current) => {
            let filePath = parse(relative(rootDir, current));
            let entry = join(filePath.dir, filePath.name);
            value[entry] || (value[entry] = []);
            value[entry].push(resolve(rootDir, current));
            return value;
        }, {});
    }

    private getEntryPoints(entries: string[]) {
        const obj = {};
        entries.forEach(entry => obj[entry] = globby.sync(resolve(this.srcDir, entry) + '\.*'));
        return obj;
    }

    resolve(environment: Environment) {
        const pages = this.getPages();
        const components = this.getComponents(pages);
        return pickBy({
            ...this.getEntries(this.srcDir, [this.srcDir + '/*']),
            ...this.getEntryPoints(pages),
            ...this.getEntryPoints(components),
            styles: './src/styles/index.scss',
            mock: environment.localMock ? globby.sync([this.srcDir + '/mock/**']) : undefined
        }, identity);
    }
}
