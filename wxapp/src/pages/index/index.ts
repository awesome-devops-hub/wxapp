import { httpService } from '../../core/service/HttpService';
import { WxPage } from '../../core/wx/WxPage';
import { pagify } from '../../core/utils/Utils';
import {
  ArticleListRequest,
  ArticleListResponse,
  ArticleModuleRequest,
  ArticleModuleResponse,
  IArticleListRequest
} from "../../protocol/ArticleProto";

interface State {
  extraData: any
}

class IndexPage extends WxPage<State> {

  data = {
    loading: true,
    loadingArticle: true,
    loadingMoreArticle: false,
    modules: [],
    articles: [],
    activeTab: '',
    pageable: { page: 1, size: 5 },
    totalCount: 0,
    extraData: { url: 'https://www.baidu.com' }
  };

  onLoad(_query: Record<string, string | undefined>) {
    this.init();
  }

  onShow() {
    typeof this.getTabBar === 'function' && this.getTabBar().setData({ active: 0 });
  }

  onSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  }

  onPullDownRefresh() {
    this.reloadArticle();
  }

  onLoadMore() {
    if (this.data.loadingMoreArticle) {
      return;
    }
    this.setData({
      loadingMoreArticle: true,
    });
    this.loadMoreArticle();
  }

  onTabChange(e) {
    const name = e?.detail?.name;
    this.setData({
      activeTab: name,
      loadingArticle: true,
    }, () => {
      this.reloadArticle();
    });
  }

  init() {
    return httpService.request(ArticleModuleRequest.create())
      .subscribe((res: ArticleModuleResponse) => {
        this.setData({
          modules: res.modules,
          activeTab: res.modules[0]?.id,
          loading: false,
        });
        this.reloadArticle();
      });
  }

  reloadArticle() {
    const payload: IArticleListRequest = {
      pageable: { page: 1, size: 5 },
      module: this.data.activeTab
    };
    httpService.request(ArticleListRequest.create(payload))
      .subscribe((res) => {
        this.setData({
          articles: res.entries,
          pageable: { page: res.pageable.page, size: res.pageable.size },
          totalCount: res.pageable.totalCount,
          loadingArticle: false
        });
      });
  }

  loadMoreArticle() {
    const { pageable, articles, activeTab } = this.data;
    const payload = {
      pageable: {
        ...pageable,
        page: pageable.page + 1,
      },
      module: activeTab
    };
    httpService.request(ArticleListRequest.create(payload))
      .subscribe((res: ArticleListResponse) => {
        this.setData({
          articles: [...articles, ...res.entries],
          pageable: { page: res.pageable.page, size: res.pageable.size },
          totalCount: res.pageable.totalCount,
          loadingMoreArticle: false,
        });
        wx.stopPullDownRefresh();
      });
  }
}

pagify(new IndexPage());
