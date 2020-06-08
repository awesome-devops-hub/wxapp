import { MockData } from "../Mock";
import {
  HotSearchRequest,
  SearchHistoryRequest,
  HotSearchResponse,
  SearchHistoryResponse,
  SearchResultRequest,
  SearchResultResponse,
  ISearchResultPb,
} from "../../protocol/SearchProto";

const pagerMock = {
  page: 1,
  size: 5,
  totalCount: 18,
  totalPage: 4,
};

const searchEntriesMock = [
  "Leave Policy",
  "Salary Statement",
  "How to",
  "VPN Stuff",
  "Wifi Guest",
  "Offices",
  "Admin Contacts",
  "Insurance",
  "EAP",
  "Code of Conduct",
  "Invoice",
  "Buddy Program",
];
const articleModuleMock = ["News", "Policy"];
const articleEntriesMock = [
  {
    title: "碎片化时代，找准你的增长飞轮",
    id: "1",
    category: "博客大赛",
  },
  {
    title: "Bug Report该怎么做",
    id: "2",
    category: "博客大赛",
  },
  {
    title: "你的能力和态度及格了吗",
    id: "3",
    category: "博客大赛",
  },
  {
    title: "5分钟让你学会高效组织结构-全功能团队，没学会请自己找原因！",
    id: "4",
    category: "博客大赛",
  },
  {
    title: "微信小程序技术原理与开发框架评析",
    id: "5",
    category: "博客大赛",
  },
  {
    title: "如果你想转岗做BA",
    id: "6",
    category: "博客大赛",
  },
];

function generateSearchResult(): ISearchResultPb[] {
  let mods = articleModuleMock.slice(getRandomIntInclusive(0, 2));
  let result: ISearchResultPb[] = [];
  for (let index = 0; index < mods.length; index++) {
    const entries = articleEntriesMock.slice(getRandomIntInclusive(0, 5));
    if (entries.length > 0) {
      result.push({
        module: mods[index],
        entries: entries,
        paging: pagerMock,
      });
    }
  }
  return result;
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const mockSearch: MockData[] = [
  {
    request: HotSearchRequest,
    response: () =>
      HotSearchResponse.create({
        paging: pagerMock,
        entries: {
          entries: searchEntriesMock.slice(getRandomIntInclusive(1, 12)),
        },
      }),
  },
  {
    request: SearchHistoryRequest,
    response: () =>
      SearchHistoryResponse.create({
        paging: pagerMock,
        entries: {
          entries: searchEntriesMock.slice(getRandomIntInclusive(1, 12)),
        },
      }),
  },
  {
    request: SearchResultRequest,
    response: (req: SearchResultRequest) => {
      if (req.module) {
        return SearchResultResponse.create({
          data: [
            {
              module: req.module,
              paging: {
                page: req.pageable.page,
                size: 5,
                totalCount: 18,
                totalPage: 4,
              },
              entries: articleEntriesMock.slice(getRandomIntInclusive(0, 5)),
            },
          ],
        });
      }
      return SearchResultResponse.create({
        data: generateSearchResult(),
      });
    },
    delay: 500
  },
];
