import { WxPage } from "../../core/wx/WxPage";
import { pagify } from "../../core/utils/Utils";
import IShareAppMessageOption = WechatMiniprogram.Page.IShareAppMessageOption;
import towxml = require('../../components/towxml/index');

interface State {
    url: string;
    article: object;
}

class WebviewPage extends WxPage<State> {

    data = {
        url: '',
        article: {}
    };

    onLoad(query: Record<string, string | undefined>) {
        const { url, baseUrl, title } = query;

        wx.showLoading({ title: '加载中' });
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                let obj = towxml(res.data, 'html', { base: baseUrl });
                wx.hideLoading();
                this.setData({
                    url: url,
                    article: obj,
                    isLoading: false
                });
            }
        });
        title && wx.setNavigationBarTitle({ title: title });
    }

    onShareAppMessage(_res: IShareAppMessageOption) {
        return {
            title: "Share from webview page",
            path: `/page/webview/webview?url=${this.data.url}`,
        };
    }
}

pagify(new WebviewPage());
