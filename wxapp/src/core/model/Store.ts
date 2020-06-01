import { UserStore, userStore } from './User';
import { observable } from 'mobx';

export interface CoreStore {
    updatePage: boolean;

    checkUpdatePage(): boolean;

    setUpdatePage(): void;
}

export const coreStore = observable({
    updatePage: false,

    checkUpdatePage(): boolean {
        let update = this.updatePage;
        this.updatePage = false;
        return update;
    },

    setUpdatePage(): void {
    }
} as CoreStore);

export interface StoreProps {
    userStore?: UserStore
}

export const stores = {
    userStore
};
