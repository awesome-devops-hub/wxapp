import { Subscribable } from 'rxjs';
import { httpService } from '../../core/service/HttpService';
import { WxPage } from '../../core/wx/WxPage';
import { flatten } from '../../core/utils/Utils';
import { HelloRequest, HelloResponse } from '../../protocol/UserProto';

interface State {
    message: string
}

class IndexPage extends WxPage<State> {

    data = {
        message: ''
    };

    onLoad(_query: Record<string, string | undefined>) {
        this.reload().subscribe(res => this.setData({ message: res.message }));
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
}

Page(flatten(new IndexPage()));
