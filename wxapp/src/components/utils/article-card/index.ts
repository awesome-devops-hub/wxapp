import { httpService } from "../../../core/service/HttpService";
import { ArticleDetailRequest, ArticleDetailResponse } from "../../../protocol/ArticleEntryProto";
import { RxWx } from "../../../core/utils/RxWx";

Component({
  behaviors: [],
  properties: {
    aid: String,
    title: String,
    coverImage: String,
    category: String,
    date: String,
  },
  methods: {
    onTap: function () {
      const id = this.properties.aid;
      wx.showLoading({ title: '加载中' });
      httpService
        .request(ArticleDetailRequest.create({ id }))
        .subscribe((res: ArticleDetailResponse) => {
          RxWx.navigateTo("/pages/towxml/towxml", {
            url: res.data?.link,
            baseUrl: 'https://wxapp.qun.cool/blog/',
            title: res.data?.title
          }).subscribe(() => wx.hideLoading());
        });
    }
  }
});
