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
  leavePolicyData: IarticleEntryPb[];
  paging: IPagingPb;
}

class LeavePolicyPage extends WxPage<State> {
  data = {
    leavePolicyData: [],
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
    this.getLeavePolicy({
      pageable: { page: 1 },
      module: "leavepolicy",
    }).subscribe((res) => {
      this.setData({ leavePolicyData: res.data });
      this.setData({ paging: res.paging });
    });
  }

  getLeavePolicy(
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
    this.getLeavePolicy({
      pageable: { page: paging.page + 1 },
      module: "leavepolicy",
    }).subscribe((res) => {
      wx.hideToast();
      let originalData = this.data.leavePolicyData;
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
      this.setData({ leavePolicyData: originalData });
      this.setData({ paging: originalPaging });
    });
  }
  onShareAppMessage(res: any) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "Check Thoughtworks Leave Policy",
      path: "pages/policy/leave/policy/leave",
    };
  }
}

pagify(new LeavePolicyPage());
