import { WxPage } from "../../core/wx/WxPage";
import { pagify } from "../../core/utils/Utils";
import { httpService } from "../../core/service/HttpService";
import { IMessagePb, MessageRequest, MessageResponse } from "../../protocol/MessageProto";
import { IPageablePb } from "../../protocol/ResourceProto";

interface State {
  messages: IMessagePb[];
}

class MessagePage extends WxPage<State> {
  onLoad(_query: Record<string, string | undefined>) {
    this.init();
  }

  onShow() {
    typeof this.getTabBar === 'function' && this.getTabBar().setData({ active: 2 });
  }

  onRead(e) {
    const data = this.data.messages.map((m) => {
      if (m.id === e.target.id) {
        return { ...m, unread: false };
      }
      return m;
    });
    this.updateMessage(data);
  }

  onShareAppMessage(res: any) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "message",
      path: "/page/message/message",
    };
  }

  onReachEnd() {
    console.log('reach end');
  }

  init() {
    const pageable: IPageablePb = { page: 1, size: 10 } as IPageablePb;
    return httpService.request(MessageRequest.create({ pageable }))
      .subscribe((res: MessageResponse) => this.updateMessage(res.data));
  }

  updateMessage(data: IMessagePb[]) {
    this.setData({ messages: data });
    const unreadCount = data?.filter(d => d.unread).length || null;
    this.getTabBar().setData({ unreadCount });
  }
}

pagify(new MessagePage());
