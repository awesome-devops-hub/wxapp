import { flatten } from '../utils/Utils';
import { observable } from 'mobx';

export class Gender {
    private static codeMap: { [key: number]: Gender } = {};

    static values: Gender[] = [];

    static UNKNOWN = new Gender(0);

    static MALE = new Gender(1);

    static FEMALE = new Gender(2);

    code: number;

    private constructor(code: number) {
        Gender.codeMap[code] = this;
        Gender.values.push(this);
        this.code = code;
    }

    static of(code: number): Gender {
        return this.codeMap[code];
    }

    static ofText(text: string): Gender {
        switch (text) {
            case '男性':
                return Gender.MALE;
            case '女性':
                return Gender.FEMALE;
            default:
                return Gender.UNKNOWN;
        }
    }
}

export class UserStore {
    userId = '';
    nickname = '';
    avatar = '';
    gender = Gender.UNKNOWN;
}

export const userStore = observable(flatten(new UserStore()));
