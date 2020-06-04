import { Subscribable } from "rxjs";
import { httpService } from "../../core/service/HttpService";
import { WxPage } from "../../core/wx/WxPage";
import { flatten } from "../../core/utils/Utils";
import {
  HotSearchRequest,
  HotSearchResponse,
  SearchHistoryRequest,
  SearchHistoryResponse,
} from "../../protocol/SearchProto";

interface State {
  searchValue: string;
  hotSearch: string[];
  searchHistory:string[];
}

class SearchPage extends WxPage<State> {
  data = {
    searchValue: "",
    hotSearch: ["Hot-1", "Salary", "Leave Policy"],
    searchHistory: ["Test", "Test2"],
  };

  onLoad(_query: Record<string, string | undefined>) {
    // wx.hideHomeButton();
    this.getHotSearchTags().subscribe((res) =>
      {
        this.setData({ hotSearch: res.entries.entries });}
    );
    this.getSearchHistoryTags().subscribe((res) =>
      this.setData({ searchHistory: res.entries.entries })
    );
  }

  onChange(event) {
    console.log(event.detail);
  }

  searchTag(event) {
    this.setData({ searchValue: event.target.dataset.hi });
  }

  getHotSearchTags(): Subscribable<HotSearchResponse> {
    return httpService.request(
      HotSearchRequest.create({ pageable: { page: 1, size: 5 } })
    );
  }

  getSearchHistoryTags(): Subscribable<SearchHistoryResponse> {
    return httpService.request(
      SearchHistoryRequest.create({ pageable: { page: 1, size: 8 } })
    );
  }

  onShareAppMessage(res: any) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "Share from search page",
      path: "/page/index/index",
    };
  }
}

Page(flatten(new SearchPage()));
