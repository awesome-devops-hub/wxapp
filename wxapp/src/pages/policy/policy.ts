import { WxPage } from "../../core/wx/WxPage";
import { pagify } from "../../core/utils/Utils";

interface State {}

class PolicyPage extends WxPage<State> {
  data = {};

  onLoad(_query: Record<string, string | undefined>) {}

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
}

pagify(new PolicyPage());
