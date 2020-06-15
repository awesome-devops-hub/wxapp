import { Subscribable } from "rxjs";
import { httpService } from "../../../../core/service/HttpService";
import { WxPage } from "../../../../core/wx/WxPage";
import { pagify } from "../../../../core/utils/Utils";
import { IPagingPb } from "../../../../protocol/ResourceProto";
import {
  TravelGuidesResponse,
  IarticlePb,
  ITravelGuidesRequest,
  TravelGuidesRequest,
} from "../../../../protocol/SearchProto";

interface State {
  guides: IarticlePb[];
  paging: IPagingPb;
}

class TravelGuidesPage extends WxPage<State> {
  data = {
    guides: [],
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
    this.getTravelGuides({ pageable: { page: 1 } }).subscribe((res) => {
      this.setData({ guides: res.data });
      this.setData({ paging: res.paging });
    });
  }

  getTravelGuides(
    req: ITravelGuidesRequest
  ): Subscribable<TravelGuidesResponse> {
    return httpService.request(TravelGuidesRequest.create(req));
  }

  pageChange(event) {
    wx.showToast({
      title: "加载中",
      icon: "loading",
      duration: 800,
    });
    this.getTravelGuides({
      pageable: { page: event.currentTarget.dataset.page.page + 1 },
    }).subscribe((res) => {
      wx.hideToast();
      let originalData = this.data.guides;
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
      this.setData({ guides: originalData });
      this.setData({ paging: originalPaging });
    });
  }
  onShareAppMessage(res: any) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "Check Thoughtworks Travel Guides",
      path: "/page/policy/travel/guide/guide",
    };
  }
}

pagify(new TravelGuidesPage());
