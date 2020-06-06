import { Subscribable } from 'rxjs';
import { httpService } from '../../core/service/HttpService';
import { WxPage } from '../../core/wx/WxPage';
import { HelloRequest, HelloResponse } from '../../protocol/UserProto';
import { RxWx } from '../../core/utils/RxWx';
import { pagify } from '../../core/utils/Utils';

interface State {
    message: string,
    extraData: any
}

class IndexPage extends WxPage<State> {

    data = {
        message: '',
        extraData: { url: 'https://www.baidu.com' }
    };

    onLoad(_query: Record<string, string | undefined>) {
        this.reload().subscribe(res => {
            this.setData({ message: res.message });
        });
    }

    onPullDownRefresh() {
        this.reload().subscribe(res => {
            wx.stopPullDownRefresh();
            this.setData({ message: res.message });
        });
    }

    reload(): Subscribable<HelloResponse> {
        return httpService.request(HelloRequest.create());
    }

    openWebview() {
        RxWx.navigateTo('/pages/webview/webview', {
            title: '百度',
            url: 'https://www.baidu.com'
        }).subscribe();
    }
}

pagify(new IndexPage());
