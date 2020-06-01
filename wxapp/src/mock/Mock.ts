import RequestOption = WechatMiniprogram.RequestOption;
import RequestTask = WechatMiniprogram.RequestTask;
import { WebpbMessage } from 'webpb';
import { mockUser } from './modules/MockUser';
import find from 'lodash/find';
import { httpService } from '../core/service/HttpService';

export interface MockData {
    request: { prototype: WebpbMessage },
    response: () => any
}

const mockList: MockData[] = [
    ...mockUser
];

httpService.wxRequest = (option: RequestOption): RequestTask => {
    const message: WebpbMessage = option['__message'];
    const data: MockData = find(mockList, data => {
        const prototype = Object.getPrototypeOf(message);
        return data.request === prototype.constructor;
    });
    if (option.success) {
        const response = {
            statusCode: 200,
            data: data.response()
        } as any;
        console.log(['response', response.data]);
        option.success(response);
    }
    return undefined;
};
