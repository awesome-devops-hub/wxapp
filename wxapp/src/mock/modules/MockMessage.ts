import { MockData } from "../Mock";
import {
  MessageRequest,
  MessageResponse,
  MessageDetailRequest,
  MessageDetailResponse,
  IMessagePb,
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
      "<div class='gmail_default'><div class='gmail_default' style='color:rgb(34,34,34);font-size:14px'><span style='font-size:13.6364px'>Hi Everyone,<br></span><div style='font-size:13.6364px'><br></div><div style='font-size:13.6364px'><font face='arial, sans-serif' style='font-size:13.6364px'>新年好，新的一年了，又到了一年中最重要的时间啦，那就是——<wbr>你的<span><span><span><span><span><span><span><span><span><span><span class='il'>生日</span></span></span></span></span></span></span></span></span></span></span>来临了！不管你身处何方，祝在本月出生的你-</font><font face='arial, sans-serif' style='font-size:13.6364px'>-</font><span style='font-size:13.6364px'><span class='il'>生日</span></span><font style='font-size:13.6364px'>快乐<wbr>！</font><font face='arial, sans-serif' style='font-size:13.6364px'><span style='margin-right:0.2ex;margin-left:0.2ex'><img src='https://ci5.googleusercontent.com/proxy/qxn5wYh4MC2nU9Sil9HRwRnElsyFgzfHBoIwFVDLq15QBUUCuikP3lKya6IQW276NRhWbMkIZzEF75-2aTc0UI0=s0-d-e1-ft#https://mail.google.com/mail/e/ezweb_ne_jp/511' style='margin:0px 0.2ex;vertical-align:middle' class='CToWUd'></span></font><br></div><div style='font-size:13.6364px'><br></div><span style='font-size:13.6364px'>为了感谢大家的努力工作，感受到我们TW的温暖，</span><span style='font-size:13.6364px'>公司特为本月过<span><span><span><span><span><span><span><span><span><span><wbr><span class='il'>生日</span></span></span></span></span></span></span></span></span></span></span>的同学准备了面值200元的<span><span><span><span><span><span><span><span><span><span><span class='il'>生日</span></span></span></span></span></span></span></span></span></span></span>蛋糕卡~</span></div><div class='gmail_default' style='color:rgb(34,34,34);font-size:14px'><span style='font-size:13.6364px'><br></span></div><div class='gmail_default' style='font-size:14px'><span style='color:rgb(34,34,34);font-size:13.6364px'><font color='#0000ff'>备注说明：人数比较多，邮件是用工号加邮箱的后缀发的，<wbr>如有没收到的同学请私信我，谢谢了。<br></font></span><div style='color:rgb(34,34,34);font-size:13.6364px'><br></div><div style='color:rgb(34,34,34);font-size:13.6364px'>温馨小提示：</div><div style='color:rgb(34,34,34);font-size:13.6364px'><br></div><div style='color:rgb(34,34,34);font-size:13.6364px'><span style='font-size:13.6364px'>1.&nbsp;</span><span style='font-size:13.6364px'><span class='il'>生日</span></span><span style='font-size:13.6364px'>以身份证/护照等有效证件上登记的日期为我们的标准；</span></div><div style='color:rgb(34,34,34);font-size:13.6364px'><span style='font-size:13.6364px'><br></span><span style='font-size:13.6364px'>2. 请在</span><span style='font-size:13.6364px'><span class='il'>生日</span></span><span style='font-size:13.6364px'>当月前往行政处领取该卡：</span><font style='font-size:13.6364px'><b>北京/王敏、西安<span style='font-size:13.6364px'>/马楠/青青</span></b></font><b style='font-size:13.6364px'><wbr>、成都<span style='font-size:13.6364px'>/ 林林</span>/叶子、武汉/&nbsp;</b><b style='font-size:13.6364px'>&nbsp;鹤萌</b><b style='font-size:13.6364px'>、深圳/嘉欣；</b></div><div><span style='color:rgb(34,34,34);font-size:13.6364px'><br></span><span style='color:rgb(34,34,34);font-size:13.6364px'>3. 各地领取蛋糕卡详情：</span><ul style='color:rgb(34,34,34);font-size:13.6364px'><li style='margin-left:15px;font-size:13.6364px'>北京的供应商为--<b>味多美</b>，北京所有门店均可使用（约100家）<wbr>，总金额为200元，不限使用次数和单次消费金额，<wbr>有效期至2019年，可延期或换卡；</li></ul><ul style='color:rgb(34,34,34);font-size:13.6364px'><li style='margin-left:15px;font-size:13.6364px'>西安的供应商为--<span style='border-collapse:collapse'><b>御品轩&amp;好利来</b>，西安所有门店</span>均可使用，<wbr>总金额为200元，不限使用次数和单次消费金额，<wbr>御品轩的有效期为两年。</li></ul><ul style='color:rgb(34,34,34);font-size:13.6364px'><li style='margin-left:15px;font-size:13.6364px'>成都的供应商为--<span style='border-collapse:collapse'><b style='font-size:13.6364px'>好利来</b>，成都所有门店</span>均可使用，<wbr>总金额为200元，不限使用次数和单次消费金额；</li></ul><ul style='color:rgb(34,34,34);font-size:13.6364px'><li style='margin-left:15px;font-size:13.6364px'><span style='font-size:13.6364px'>武汉的供应商为--</span><span style='font-size:13.6364px'><b>仟吉，</b></span><span style='font-size:13.6364px;border-collapse:collapse'>武汉所有门店</span><span style='font-size:13.6364px'>均可使用，</span><span style='font-size:13.6364px'>总金额为200<wbr>元，不限使用次数和单次消费金额；</span></li></ul><ul style='color:rgb(34,34,34);font-size:13.6364px'><li style='margin-left:15px;font-size:13.6364px'><p></p><p style='margin:0px;font-variant-numeric:normal;font-variant-east-asian:normal;font-stretch:normal;font-size:13px;line-height:normal;font-family:&quot;Helvetica Neue&quot;'>深圳的供应商为--<b>BreadTalk</b>，面包新语，喜乳酪，<wbr>麦子仓库深圳所有门店均可使用，总金额为200元。<wbr>不限使用次数和单次消费金额；</p><p></p></li></ul><ul style='font-size:13.6364px'><li style='margin-left:15px'><span style='color:rgb(34,34,34);font-size:13.6364px'>上海：请自行去蛋糕店消费，金额不超过200元，凭发票报销。</span><span style='color:rgb(34,34,34);font-size:13.6364px'>发<wbr>票抬头：</span><b style='color:rgb(34,34,34);font-size:13.6364px'><font color='#cc0000'>思特沃克软件技术（北京）有限公司上海分公司</font></b>，<span style='color:rgb(34,34,34);font-size:13.6364px'>报销co</span><span style='color:rgb(34,34,34);font-size:13.6364px'><wbr>de:&nbsp;</span><span style='color:rgb(34,34,34);font-size:13.6364px;border-collapse:collapse'><b>TW_CORE PEOPLE&nbsp;</b></span><span style='font-size:13.6364px;border-collapse:collapse'><b style='color:rgb(34,34,34)'>TWER_BENEFITS</b><b style='color:rgb(34,34,34)'><span dir='ltr'></span></b><span style='border-collapse:collapse'>&nbsp; &nbsp; &nbsp; 项目：employee activity<b><font color='#ff0000'>（code有疑问的可以咨询报销的同事）</font><font color='#000000'>，</font></b></span></span><span style='color:rgb(34,34,34);font-size:13.6364px'>如在<wbr>出差或者休假，可以延后；</span></li></ul></div></div><div class='gmail_default' style='color:rgb(0,0,0)'>祝大家<span><span class='il'>生日</span></span>快乐！</div></div>",
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

const generateItem = (page: number, size: number, total: number) => {
  const _size = page * size > total ? total % size : size;
  return [...new Array(_size)].map(() => {
    const msg = messagesMock[Math.floor(Math.random() * 3)];
    return {
      ...msg,
      title: msg.title,
      // id: Math.floor(Math.random() * 10000).toString(),
    } as IMessagePb;
  });
};

export const mockMessage: MockData[] = [
  {
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
