import { WxPage } from "../../../core/wx/WxPage";
import { pagify } from "../../../core/utils/Utils";
import { httpService } from "../../../core/service/HttpService";
import { ArticleDetailRequest, ArticleDetailResponse } from "../../../protocol/ArticleEntryProto";


interface State {
  loading: boolean
  article: any
}

class ArticleDetailPage extends WxPage<State> {
  data = {
    loading: true,
    article: null,
  };

  onLoad(_query: Record<string, string | undefined>) {
    if (_query.id) {
      this.fetchArticle(_query.id);
    }
  }

  fetchArticle(id: string) {
    httpService
      .request(ArticleDetailRequest.create({ id }))
      .subscribe((res: ArticleDetailResponse) => {
        if (res.data) {
          this.setData({ article: res.data });
          wx.setNavigationBarTitle({ title: res.data.title });
        }
        this.setData({ loading: false });
      });
  }
}

pagify(new ArticleDetailPage());
