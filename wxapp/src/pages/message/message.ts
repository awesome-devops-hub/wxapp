import { WxPage } from "../../core/wx/WxPage";
import { pagify } from "../../core/utils/Utils";
import { httpService } from "../../core/service/HttpService";
import { IMessagePb, MessageRequest, MessageResponse } from "../../protocol/MessageProto";
import { IPageablePb, IPagingPb } from "../../protocol/ResourceProto";

interface State {
  paging: IPagingPb;
  triggered: boolean;
  loading: boolean;
  loadingMore: boolean;
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

  onRefresh() {
    this.init();
  }

  onReachEnd() {
    const { paging, messages, loadingMore } = this.data;
    if (loadingMore || paging.totalCount <= messages.length) {
      return;
    }
    this.setData({ loadingMore: true }, () => this.loadMore());
  }

  init() {
    this.setData({ loading: true });
    const pageable: IPageablePb = { page: 1, size: 10 };
    return httpService.request(MessageRequest.create({ pageable }))
      .subscribe((res: MessageResponse) => this.updateMessage(res.data, res.paging));
  }

  loadMore() {
    const pageable: IPageablePb = {
      ...this.data.paging,
      page: this.data.paging.page,
    };
    return httpService.request(MessageRequest.create({ pageable }))
      .subscribe((res: MessageResponse) => {
        const messages = [...this.data.messages, ...res.data];
        this.updateMessage(messages, res.paging);
      });
  }

  updateMessage(messages: IMessagePb[], paging?: IPagingPb) {
    this.setData({
      messages,
      paging,
      triggered: false,
      loading: false,
      loadingMore: false,
    });
    const unreadCount = messages?.filter(d => d.unread).length || null;
    this.getTabBar().setData({ unreadCount });
  }
}

pagify(new MessagePage());
