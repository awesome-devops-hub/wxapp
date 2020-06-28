import { MockData } from "../Mock";
import {
  MessageRequest,
  MessageResponse,
  MessageDetailRequest,
  MessageDetailResponse,
} from "../../protocol/MessageProto";
import { simulatePagination } from "../Utils";

const pagingMock = {
  page: 1,
  size: 5,
  totalCount: 18,
  totalPage: 4,
};

enum category {
  POLICY = "POLICY",
  GENERAL = "GENERAL",
}

const messagesMock = [
  {
    title: "生日快乐！",
    id: "1",
    summary: "今天是你的生日，快来领取生日卡吧！",
    unread: true,
    category: category.GENERAL,
    link: "",
  },
  {
    title: "普通消息示例",
    id: "2",
    summary: "点此查看",
    unread: true,
    category: category.GENERAL,
    link: "",
  },
  {
    title: "更换电脑",
    id: "444",
    summary: "你的电脑已经到达使用期限，可以更换新电脑了哦",
    unread: true,
    category: category.POLICY,
    link: "https://wxapp.qun.cool/blog/blog-02.html",
  },
];

const messagesDetailMock = [
  {
    title: "生日快乐！",
    id: "1",
    content:
      "<h3>今天是你的生日，快来领取生日卡吧！</h3> <br/> <img style='width:100%;' alt='cover' src='http://img3.imgtn.bdimg.com/it/u=2774391408,3578926483&fm=214&gp=0.jpg'/>",
  },
  {
    title: "政策已更新",
    id: "2",
    content:
      "<p class='MsoNormal' style='background:white'><span lang='ZH-CN' style='font-size: 13.0pt;font-family:SimSun;color:#333333;letter-spacing:.4pt'>对于很多公司，其实都没有</span><span lang='EN-US' style='font-size:13.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333; letter-spacing:.4pt'>BA</span><span lang='ZH-CN' style='font-size:13.0pt; font-family:SimSun;color:#333333;letter-spacing:.4pt'>这个角色，就算对于</span><span lang='EN-US' style='font-size:13.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333; letter-spacing:.4pt'>ThoughtWorks</span><span lang='ZH-CN' style='font-size:13.0pt; font-family:SimSun;color:#333333;letter-spacing:.4pt'>的小伙伴，项目上有</span><span lang='EN-US' style='font-size:13.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333; letter-spacing:.4pt'>BA</span><span lang='ZH-CN' style='font-size:13.0pt; font-family:SimSun;color:#333333;letter-spacing:.4pt'>这个角色的，能看到的也只是</span><span lang='EN-US' style='font-size:13.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333; letter-spacing:.4pt'>BA</span><span lang='ZH-CN' style='font-size:13.0pt; font-family:SimSun;color:#333333;letter-spacing:.4pt'>工作的一部分内容，很难了解到</span><span lang='EN-US' style='font-size:13.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333; letter-spacing:.4pt'>BA</span><span lang='ZH-CN' style='font-size:13.0pt; font-family:SimSun;color:#333333;letter-spacing:.4pt'>职责的全貌。一句话概括</span><span lang='EN-US' style='font-size:13.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333; letter-spacing:.4pt'>ThoughtWorks BA</span><span lang='ZH-CN' style='font-size: 13.0pt;font-family:SimSun;color:#333333;letter-spacing:.4pt'>的核心职责：<b>把客户爸爸的业务需求（或者</b></span><b><span lang='EN-US' style='font-size:13.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#333333; letter-spacing:.4pt'>idea</span></b><b><span lang='ZH-CN' style='font-size:13.0pt; font-family:SimSun;color:#333333;letter-spacing:.4pt'>）转化成可以落地的解决方案，把解决方案拆解成为开发能够入手实现的任务，并且在项目运作过程中保证这些解决方案的实现。</span></b></p>",
  },
  {
    title: "更换电脑",
    id: "444",
    content: "你的电脑已经到达使用期限，可以更换新电脑了哦",
  },
];

export const mockMessage: MockData[] = [
  {
    request: MessageRequest,
    response: (req: MessageRequest) => {
      console.log("req", req);
      console.log(simulatePagination);
      let messages = [];
      for (const _n in [1, 2, 3, 4, 5]) {
        messages = [
          ...messages,
          ...messagesMock.map((msg) => ({ ...msg, id: msg.id })),
        ];
      }
      return {
        data: messages,
        paging: pagingMock,
      } as MessageResponse;
    },
    delay: 1500,
  },
  {
    request: MessageDetailRequest,
    response: (req: MessageDetailRequest) => {
      let res = messagesDetailMock.find((ele) => ele.id === req.id);

      return {
        data: res,
      } as MessageDetailResponse;
    },
    delay: 500,
  },
];
