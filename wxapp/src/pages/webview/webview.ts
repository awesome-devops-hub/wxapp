import { WxPage } from "../../core/wx/WxPage";
import { pagify } from "../../core/utils/Utils";
import IShareAppMessageOption = WechatMiniprogram.Page.IShareAppMessageOption;

interface State {
    url: string;
}

class WebviewPage extends WxPage<State> {

    data = {
        url: ''
    };

    onLoad(query: Record<string, string | undefined>) {
        console.log('webview: ', query);
        query.title && wx.setNavigationBarTitle({ title: query.title });
        this.setData({ url: query.url });
    }

    onShareAppMessage(_res: IShareAppMessageOption) {
        return {
            title: "Share from webview page",
            path: `/page/webview/webview?url=${this.data.url}`,
        };
    }
}

pagify(new WebviewPage());
