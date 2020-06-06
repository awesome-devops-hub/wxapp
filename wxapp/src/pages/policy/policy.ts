import { WxPage } from "../../core/wx/WxPage";
import { pagify } from "../../core/utils/Utils";

interface State {
}

class PolicyPage extends WxPage<State> {
    data = {};

    onLoad(_query: Record<string, string | undefined>) {
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
}

pagify(new PolicyPage());
