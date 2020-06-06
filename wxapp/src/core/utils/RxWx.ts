import { Observable } from 'rxjs';
import GetUserInfoSuccessCallbackResult = WechatMiniprogram.GetUserInfoSuccessCallbackResult;
import GetSettingSuccessCallbackResult = WechatMiniprogram.GetSettingSuccessCallbackResult;
import LoginSuccessCallbackResult = WechatMiniprogram.LoginSuccessCallbackResult;
import NavigateToSuccessCallbackResult = WechatMiniprogram.NavigateToSuccessCallbackResult;
import { WxPage } from '../wx/WxPage';

export const RxWx = new class {

    getSetting(): Observable<GetSettingSuccessCallbackResult> {
        return new Observable<GetSettingSuccessCallbackResult>(subscriber => {
            wx.getSetting({
                success: res => {
                    subscriber.next(res);
                    subscriber.complete();
                },
                fail: res => subscriber.error(res)
            });
        });
    }

    getUserInfo(): Observable<GetUserInfoSuccessCallbackResult> {
        return new Observable<GetUserInfoSuccessCallbackResult>(subscriber => {
            wx.getUserInfo({
                success: res => {
                    subscriber.next(res);
                    subscriber.complete();
                },
                fail: res => subscriber.error(res)
            });
        });
    }

    login(): Observable<LoginSuccessCallbackResult> {
        return new Observable<LoginSuccessCallbackResult>(subscriber => {
            wx.login({
                success: res => {
                    subscriber.next(res);
                    subscriber.complete();
                },
                fail: res => subscriber.error(res)
            });
        });
    }

    navigateTo(url: string, params?: any, events?: any): Observable<NavigateToSuccessCallbackResult> {
        WxPage.pageParams = params || WxPage.pageParams;
        return new Observable<NavigateToSuccessCallbackResult>(subscriber => {
            wx.navigateTo({
                url: url,
                events: events,
                success: res => {
                    subscriber.next(res);
                    subscriber.complete();
                },
                fail: res => subscriber.error(res)
            });
        });
    }
};
