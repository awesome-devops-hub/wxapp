import { Subscribable } from "rxjs";
import { httpService } from "../../core/service/HttpService";
import { WxPage } from "../../core/wx/WxPage";
import { flatten } from "../../core/utils/Utils";
import {
  SearchResultRequest,
  SearchResultResponse,
  ISearchResultPb,
  ISearchResultRequest,
} from "../../protocol/SearchProto";

interface State {
  searchValue: string;
  loading: boolean;
  activeTab: number;
  activeModule: string;
  dataResult: ISearchResultPb[];
}

const searchReqMock: ISearchResultRequest = {
  pageable: { page: 1, size: 5 },
  key: "12",
  module: "",
};

class SearchResultPage extends WxPage<State> {
  data = {
    searchValue: "",
    loading: true,
    activeTab: 0,
    activeModule: "",
    dataResult: null,
  };

  onLoad(_query: Record<string, string | undefined>) {
    if (_query.key) {
      this.setData({ searchValue: _query.key });
      this.initSearch();
    }
  }

  initSearch() {
    this.getSearchResult(searchReqMock).subscribe((res) => {
      this.clearLoading();
      this.setData({
        dataResult: res.data,
      });
      if (res.data.length > 0) {
        this.setData({
          activeModule: res.data[0].module,
        });
      }
    });
  }

  clearLoading() {
    this.setData({ loading: false });
  }

  onSearch(event) {
    this.setData({ searchValue: event.detail });
    this.initSearch();
  }

  tabChange(event) {
    this.setData({ activeTab: event.detail.index });
  }

  pageChange(event) {
    wx.showToast({
      title: "加载中",
      icon: "loading",
      duration: 800,
    });
    this.getSearchResult({
      pageable: { page: event.currentTarget.dataset.page.page + 1 },
      module: this.data.dataResult[this.data.activeTab].module,
      key: this.data.searchValue,
    }).subscribe((res) => {
      wx.hideToast();
      let originalData = this.data.dataResult;
      if (res.data[0].entries.length > 0) {
        let merged = originalData[this.data.activeTab].entries.concat(
          res.data[0].entries
        );
        originalData[this.data.activeTab].entries = merged;
        originalData[this.data.activeTab].paging = res.data[0].paging;
      } else {
        originalData[this.data.activeTab].paging = {
          page: 2,
          size: 5,
          totalCount: 6,
          totalPage: 2,
        };
      }
      this.setData({ dataResult: originalData });
    });
  }

  getSearchResult(
    req: ISearchResultRequest
  ): Subscribable<SearchResultResponse> {
    return httpService.request(SearchResultRequest.create(req));
  }

  onShareAppMessage(res: any) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "查看搜索结果",
      path: "pages/search-result/search-result?key" + this.data.searchValue,
    };
  }
}

Page(flatten(new SearchResultPage()));
