import { Subscribable } from "rxjs";
import { httpService } from "../../../../core/service/HttpService";
import { WxPage } from "../../../../core/wx/WxPage";
import { pagify } from "../../../../core/utils/Utils";
import { IPagingPb } from "../../../../protocol/ResourceProto";
import {
  PolicyArticlesRequest,
  IPolicyArticlesRequest,
  PolicyArticlesResponse,
} from "../../../../protocol/SearchProto";
import { IarticleEntryPb } from "../../../../protocol/ArticleEntryProto";

interface State {
  housingFundData: IarticleEntryPb[];
  paging: IPagingPb;
}

class HousingFundPage extends WxPage<State> {
  data = {
    housingFundData: [],
    paging: {
      page: 1,
      size: 5,
      totalCount: 20,
      totalPage: 4,
    },
  };

  onLoad(_query: Record<string, string | undefined>) {
    this.initData();
  }

  initData() {
    this.getHousingFund({
      pageable: { page: 1 },
      module: "housingfund",
    }).subscribe((res) => {
      this.setData({ housingFundData: res.data });
      this.setData({ paging: res.paging });
    });
  }

  getHousingFund(
    req: IPolicyArticlesRequest
  ): Subscribable<PolicyArticlesResponse> {
    return httpService.request(PolicyArticlesRequest.create(req));
  }

  pageChange(event) {
    wx.showToast({
      title: "加载中",
      icon: "loading",
      duration: 800,
    });
    const paging: IPagingPb = event.detail.currentTarget.dataset.page;
    this.getHousingFund({
      pageable: { page: paging.page + 1 },
      module: "housingfund",
    }).subscribe((res) => {
      wx.hideToast();
      let originalData = this.data.housingFundData;
      let originalPaging = this.data.paging;
      if (res.data.length > 0) {
        const merged = originalData.concat(res.data);
        originalData = merged;
        originalPaging = res.paging;
      } else {
        originalPaging = {
          page: 2,
          size: 5,
          totalCount: 6,
          totalPage: 2,
        };
      }
      this.setData({ housingFundData: originalData });
      this.setData({ paging: originalPaging });
    });
  }
  onShareAppMessage(res: any) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "Check Thoughtworks Staff Housing Fund",
      path: "/page/policy/staff/housing-fund/housing",
    };
  }
}

pagify(new HousingFundPage());
