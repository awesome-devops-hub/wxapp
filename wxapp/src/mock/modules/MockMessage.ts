import { MockData } from "../Mock";
import { IMessagePb, MessageRequest, MessageResponse } from "../../protocol/MessageProto";
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

const generateItem = (page: number, size: number, total: number) => {
  const _size = (page * size > total) ? total % size : size;
  return [...new Array(_size)].map(() => {
    const msg = messagesMock[Math.floor(Math.random() * 3)];
    return {
      ...msg,
      title: msg.title,
      id: Math.floor(Math.random() * 10000).toString(),
    } as IMessagePb;
  });
};

export const mockMessage: MockData[] = [{
  request: MessageRequest,
  response: (req: MessageRequest) => {
    const { size, page } = req.pageable;
    return MessageResponse.create({
      data: generateItem(page, size, pagingMock.totalCount),
      unreadCount: pagingMock.totalCount,
      paging: simulatePagination(page, size, pagingMock.totalCount),
    });
  },
  delay: 1500,
}
];
