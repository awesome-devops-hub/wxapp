import { Subscribable } from "rxjs";
import { httpService } from "../../core/service/HttpService";
import { WxPage } from "../../core/wx/WxPage";
import { pagify } from "../../core/utils/Utils";
import {
  AnnualLeaveInfoRequest,
  IAnnualLeaveInfoRequest,
  AnnualLeaveInfoResponse,
  IAnnualLeavePb,
} from "../../protocol/LeaveProto";

interface State {
  annualLeaveDialogue: boolean;
  leaveInfo: IAnnualLeavePb;
  dateYear: string;
  dateInfo: string;
}

class PolicyPage extends WxPage<State> {
  data = {
    annualLeaveDialogue: false,
    leaveInfo: { taken: "0", balanceToDate: "0", balanceToYearEnd: "0" },
    dateYear: "",
    dateInfo: "",
  };

  onLoad(_query: Record<string, string | undefined>) {
    this.getAnnualLeaveInfoByEmail({
      email: "user_email",
    }).subscribe((res) => {
      console.log("leave req", res);
      if (res.data) {
        this.setData({
          leaveInfo: res.data,
        });
      } else {
        this.setData({
          leaveInfo: { taken: "3", balanceToDate: "7", balanceToYearEnd: "15" },
        });
      }
    });

    this.setDateString();
  }

  setDateString() {
    let d = Date.now();
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "numeric" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    this.setData({ dateYear: ye });
    this.setData({ dateInfo: ye + "年" + mo + "月" + da + "日" });
  }

  onShow() {
    typeof this.getTabBar === "function" &&
      this.getTabBar().setData({ active: 1 });
  }

  onChange(event) {
    console.log(event.detail);
  }

  onShareAppMessage(res: any) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "Share from search page",
      path: "/page/policy",
    };
  }

  toCtrip() {
    wx.navigateToMiniProgram({
      appId: "wx0adc5ca09c9e457a",
      path: "", // default home page
      extraData: {},
      envVersion: "release", // should be release, if we want to testing using local dev version
      success(res) {
        console.log("to ctrip", res);
      },
    });
  }

  toDidi() {
    wx.navigateToMiniProgram({
      appId: "wxaf35009675aa0b2a",
      path: "",
      envVersion: "release",
      success(res) {
        console.log("to ctrip", res);
      },
    });
  }

  showAnnualLeaveDialogue() {
    this.setData({ annualLeaveDialogue: true });
  }
  onDialogueClose() {
    this.setData({ annualLeaveDialogue: false });
  }

  getAnnualLeaveInfoByEmail(
    req: IAnnualLeaveInfoRequest
  ): Subscribable<AnnualLeaveInfoResponse> {
    return httpService.request(AnnualLeaveInfoRequest.create(req));
  }
}

pagify(new PolicyPage());
