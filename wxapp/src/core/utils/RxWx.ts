import { Observable } from 'rxjs';
import GetUserInfoSuccessCallbackResult = WechatMiniprogram.GetUserInfoSuccessCallbackResult;
import GetSettingSuccessCallbackResult = WechatMiniprogram.GetSettingSuccessCallbackResult;
import LoginSuccessCallbackResult = WechatMiniprogram.LoginSuccessCallbackResult;

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
};
