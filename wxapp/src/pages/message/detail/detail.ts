import { httpService } from "../../../core/service/HttpService";
import { WxPage } from "../../../core/wx/WxPage";
import { pagify } from "../../../core/utils/Utils";
import {
  MessageDetailRequest,
  MessageDetailResponse,
  IMessageDetailPb,
} from "../../../protocol/MessageProto";

interface State {
  message: IMessageDetailPb;
  loading: boolean;
}

class MessageDetailPage extends WxPage<State> {
  data = {
    message: null,
    loading: true,
  };

  onLoad(_query: Record<string, string | undefined>) {
    if (_query.id) {
      this.getMessage(_query.id);
    }
  }

  getMessage(_id: string) {
    httpService
      .request(MessageDetailRequest.create({ id: _id }))
      .subscribe((res: MessageDetailResponse) => {
        if (res.data) {
          this.setData({ message: res.data });
          wx.setNavigationBarTitle({ title: res.data.title });
        }
        this.setData({ loading: false });
      });
  }
}

pagify(new MessageDetailPage());
