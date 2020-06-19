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
import { IarticlePb } from "../../../../protocol/ArticleProto";

interface State {
  hotelData: IarticlePb[];
  paging: IPagingPb;
}

class ContractHotelPage extends WxPage<State> {
  data = {
    hotelData: [],
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
    this.getContractHotels({
      pageable: { page: 1 },
      module: "hotel",
    }).subscribe((res) => {
      this.setData({ hotelData: res.data });
      this.setData({ paging: res.paging });
    });
  }

  getContractHotels(
    req: IPolicyArticlesRequest
  ): Subscribable<PolicyArticlesResponse> {
    return httpService.request(PolicyArticlesRequest.create(req));
  }

  pageChange(paging: IPagingPb) {
    wx.showToast({
      title: "加载中",
      icon: "loading",
      duration: 800,
    });
    this.getContractHotels({
      pageable: { page: paging.page + 1 },
      module: "hotel",
    }).subscribe((res) => {
      wx.hideToast();
      let originalData = this.data.hotelData;
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
      this.setData({ hotelData: originalData });
      this.setData({ paging: originalPaging });
    });
  }
  onShareAppMessage(res: any) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "Check Thoughtworks Contract Hotels",
      path: "/page/policy/travel/hotel/hotel",
    };
  }
}

pagify(new ContractHotelPage());
