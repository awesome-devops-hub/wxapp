import { WxPage } from "../../core/wx/WxPage";
import { pagify } from "../../core/utils/Utils";
import { httpService } from "../../core/service/HttpService";
import { IMessagePb, MessageRequest, MessageResponse } from "../../protocol/MessageProto";
import { IPageablePb, IPagingPb } from "../../protocol/ResourceProto";

interface State {
  messages: IMessagePb[];
  paging: IPagingPb;
  unreadCount: number;
  triggered: boolean;
  loading: boolean;
  loadingMore: boolean;
}

class MessagePage extends WxPage<State> {
  onLoad(_query: Record<string, string | undefined>) {
    this.init();
  }

  onShow() {
    typeof this.getTabBar === 'function' && this.getTabBar().setData({ active: 2 });
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

  onRead(e) {
    const { messages, paging, unreadCount } = this.data;
    const data = messages.map((m) => {
      if (m.id === e.target.id) {
        return { ...m, unread: false };
      }
      return m;
    });
    const unread = unreadCount - 1;
    this.updateMessage(data, paging, unread);
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
      .subscribe((res: MessageResponse) => this.updateMessage(res.data, res.paging, res.unreadCount));
  }

  loadMore() {
    const pageable: IPageablePb = {
      ...this.data.paging,
      page: this.data.paging.page + 1,
    };
    return httpService.request(MessageRequest.create({ pageable }))
      .subscribe((res: MessageResponse) => {
        const messages = [...this.data.messages, ...res.data];
        this.updateMessage(messages, res.paging);
      });
  }

  updateMessage(messages: IMessagePb[], paging?: IPagingPb, unreadCount?: number) {
    this.setData({
      messages,
      paging,
      unreadCount,
      triggered: false,
      loading: false,
      loadingMore: false,
    });
    if (unreadCount) {
      this.getTabBar().setData({ unreadCount });
      wx.setStorageSync('unreadCount', unreadCount);
    }
  }
}

pagify(new MessagePage());
