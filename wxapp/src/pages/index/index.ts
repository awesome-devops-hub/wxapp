import { Subscribable } from 'rxjs';
import { httpService } from '../../core/service/HttpService';
import { WxPage } from '../../core/wx/WxPage';
import { HelloRequest, HelloResponse } from '../../protocol/UserProto';
import { RxWx } from '../../core/utils/RxWx';
import { pagify } from '../../core/utils/Utils';
import { ArticleModuleRequest, ArticleModuleResponse } from "../../protocol/ArticleProto";

interface State {
    extraData: any
}

class IndexPage extends WxPage<State> {

    data = {
        loading: true,
        loadingArticle: true,
        modules: [],
        activeTab: '',
        extraData: { url: 'https://www.baidu.com' }
    };

    onLoad(_query: Record<string, string | undefined>) {
        this.init().subscribe((res: ArticleModuleResponse) => {
            this.setData({
                modules: res.modules,
                activeTab: res.modules[0]?.id,
                loading: false,
            });
        });
        setTimeout(() => this.setData({ loadingArticle: false }), 500);
    }

    onPullDownRefresh() {
        // this.reload().subscribe(res => {
        //     wx.stopPullDownRefresh();
        //     this.setData({ message: res.message });
        // });
    }

    onSearch() {
        wx.navigateTo({ url: '/pages/search/search' });
    }

    init() {
        return httpService.request(ArticleModuleRequest.create());
    }

    reload(): Subscribable<HelloResponse> {
        return httpService.request(HelloRequest.create());
    }

    loadMore() {
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
