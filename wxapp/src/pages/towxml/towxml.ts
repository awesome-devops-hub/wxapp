import { WxPage } from "../../core/wx/WxPage";
import { pagify } from "../../core/utils/Utils";
import IShareAppMessageOption = WechatMiniprogram.Page.IShareAppMessageOption;
import towxml = require('../../core/towxml/index');

interface State {
    url: string;
    baseUrl: string;
    article: object;
}

class WebviewPage extends WxPage<State> {

    data = {
        url: '',
        baseUrl: '',
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
                    baseUrl: baseUrl,
                    article: obj,
                    isLoading: false
                });
            }
        });
        title && wx.setNavigationBarTitle({ title: title });
    }

    onShareAppMessage(_res: IShareAppMessageOption) {
        const { url, baseUrl } = this.data;
        return {
            title: "Share from towxml page",
            path: `/pages/towxml/towxml?url=${url}&baseUrl=${baseUrl}`,
        };
    }
}

pagify(new WebviewPage());
