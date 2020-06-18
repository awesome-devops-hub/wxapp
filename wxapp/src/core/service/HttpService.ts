import { Const } from "../utils/Const";
import { from, Observable, of, ReplaySubject, throwError } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { Errors } from "../types/Errors";
import { WebpbMessage } from "webpb";
import {
  UserMpLoginRequest,
  UserMpLoginResponse,
} from "../../protocol/UserProto";
import { ErrorMessage } from "../../protocol/ErrorProto";
import { RxWx } from "../utils/RxWx";
import { environment } from "../../app";
import RequestOption = WechatMiniprogram.RequestOption;
import RequestTask = WechatMiniprogram.RequestTask;

export function formatUrl(url: string): string {
  return !url.startsWith("https://") && !url.startsWith("http://")
    ? environment.host + url
    : url;
}

export const httpService = new (class {
  private token: string;

  private expiryTime = 0;

  private loginSubject: ReplaySubject<UserMpLoginResponse> = null;

  wxRequest: (option: RequestOption) => RequestTask = wx.request;

  public getToken(): string {
    if (this.expiryTime > 0 && this.expiryTime < Date.now()) {
      this.token = null;
      this.loginSubject = null;
    }
    return this.token;
  }

  request(message: WebpbMessage): Observable<any> {
    console.log(["doRequest", message]);
    const token = this.getToken();
    if (token) {
      return this.doRequest(message);
    }
    if (!this.loginSubject) {
      this.loginSubject = new ReplaySubject<UserMpLoginResponse>();
      from(RxWx.login())
        .pipe(
          mergeMap((res) =>
            this.doRequest<UserMpLoginResponse>(
              UserMpLoginRequest.create({
                appId: Const.APP_ID,
                code: res.code,
              })
            )
          ),
          map((res: UserMpLoginResponse) => {
            this.token = res.token;
            this.expiryTime = Date.now() + 3600000;
            return res;
          }),
          catchError((e) => of({ error: e }))
        )
        .subscribe((e: any) => {
          if (e.error) {
            this.loginSubject = null;
            throw e.error;
          } else {
            this.loginSubject.next(e);
            this.loginSubject.complete();
            this.loginSubject = null;
          }
        });
    }
    return this.loginSubject.pipe(mergeMap(() => this.doRequest(message)));
  }

  private doRequest = <T>(message: WebpbMessage): Observable<T> => {
    const meta = message.META();
    return new Observable<WechatMiniprogram.RequestSuccessCallbackResult>(
      (subscriber) => {
        const option: WechatMiniprogram.RequestOption = {
          method: meta.method as any,
          url: formatUrl(meta.path),
          header: this.header(this.getToken()),
          dataType: "json",
          responseType: "text",
          data: JSON.stringify(message),
          success: (res) => {
            subscriber.next(res);
            subscriber.complete();
          },
          fail: (res) => subscriber.error(res),
        };
        environment.localMock && (option["__message"] = message);
        this.wxRequest(option);
      }
    ).pipe(
      catchError((_) => {
        console.log("[ error ]=>",_);

        return of({ statusCode: -1, data: { message: "请求失败" } });
      }),
      mergeMap((res) => {
        const code = res.statusCode;
        if (code === -1) {
          wx.showToast({ icon: "none", title: res.data + "" });
          return throwError(res.data);
        } else if (this.isSuccess(code)) {
          const data = res.data;
          return of(data);
        } else {
          if (code === 401) {
            this.expiryTime = 0;
            this.token = undefined;
            return this.request(message);
          } else if (code === 403) {
            wx.showToast({ icon: "none", title: "没有权限" });
          } else if (code === 400) {
            let code = (res.data as ErrorMessage).errCode;
            wx.showToast({ icon: "none", title: `${Errors[code]}` });
          } else if (code === 404) {
            wx.showToast({ icon: "none", title: "请求接口无效" });
          } else {
            wx.showToast({ icon: "none", title: res.data + "" });
          }
          return throwError(res.data);
        }
      })
    );
  };

  isSuccess(code: number): boolean {
    return code === 200 || code === 201 || code === 204;
  }

  header(token?: string): any {
    let contentType = this.contentType();
    const header = {
      "content-type": contentType,
      Accept: contentType + ", */*",
    };
    token && (header["Authorization"] = `Bearer ${token}`);
    return header;
  }

  contentType(): string {
    return `application/json`;
  }
})();
