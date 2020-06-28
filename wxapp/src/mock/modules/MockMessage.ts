import { MockData } from "../Mock";
import { MessageRequest, MessageResponse } from "../../protocol/MessageProto";
import { simulatePagination } from "../Utils";

const pagingMock = {
  page: 1,
  size: 5,
  totalCount: 18,
  totalPage: 4,
};

const messagesMock = [
  {
    title: "生日快乐！",
    id: "1",
    summary: '今天是你的生日，快来领取生日卡吧！',
    unread: true
  },
  {
    title: "政策已更新",
    id: "2",
    summary: '中国区的政策更新啦，点此查看',
    unread: true
  },
  {
    title: "更换电脑",
    id: "444",
    summary: '你的电脑已经到达使用期限，可以更换新电脑了哦',
    unread: true
  },
];

export const mockMessage: MockData[] = [{
  request: MessageRequest,
  response: (req: MessageRequest) => {
    console.log('req', req);
    console.log(simulatePagination);
    // const { size, page } = req.pageable;
    let messages = [];
    for (const n in [1, 2, 3, 4, 5]) {
      messages = [...messages, ...messagesMock.map(msg => ({ ...msg, id: n + msg.id }))];
    }
    return {
      data: messages,
      paging: pagingMock,
    } as MessageResponse;
  },
  delay: 1500,
}
];
