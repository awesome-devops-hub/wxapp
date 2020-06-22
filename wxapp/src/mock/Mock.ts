import RequestOption = WechatMiniprogram.RequestOption;
import RequestTask = WechatMiniprogram.RequestTask;
import { WebpbMessage } from 'webpb';
import find from 'lodash/find';
import { httpService } from '../core/service/HttpService';
import { mockUser } from './modules/MockUser';
import { mockSearch } from "./modules/MockSearch";
import { mockArticle } from "./modules/MockArticle";
import { mockLeave } from './modules/MockLeave';
import { mockMessage } from "./modules/MockMessage";

export interface MockData {
    request: { prototype: WebpbMessage },
    response: (request: any) => any,
    delay?: number
}

const mockList: MockData[] = [...mockUser, ...mockSearch,...mockArticle,...mockLeave, ...mockMessage];

httpService.wxRequest = (option: RequestOption): RequestTask => {
    const message: WebpbMessage = option['__message'];
    const data: MockData = find(mockList, data => {
        const prototype = Object.getPrototypeOf(message);
        return data.request === prototype.constructor;
    });
    if (option.success) {
        const response = {
            statusCode: 200,
            data: data.response(message)
        } as any;
        console.log(['response', response.data]);
        const delay = data.delay || 0;
        if (delay) {
            setTimeout(() => option.success(response), delay);
        } else {
            option.success(response);
        }
    }
    return undefined;
};
