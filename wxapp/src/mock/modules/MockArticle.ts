import { MockData } from "../Mock";
import {
  ArticleListRequest,
  ArticleListResponse,
  ArticleModuleRequest,
  ArticleModuleResponse, IArticlePb
} from "../../protocol/ArticleProto";
import { simulatePagination } from "../Utils";

const pagingMock = {
  page: 1,
  size: 5,
  totalCount: 18,
  totalPage: 4,
};

const articleModuleMock = [{
  title: 'Newsletter',
  id: 'newsletter'
}, {
  title: '活动',
  id: 'activity'
}, {
  title: '博客大赛',
  id: 'blog'
}, {
  title: 'Admin',
  id: 'admin'
}];

const articleMock = [
  {
    title: "碎片化时代，找准你的增长飞轮",
    id: "1",
    category: "博客大赛",
    date: '一天前'
  },
  {
    title: "Bug Report该怎么做",
    id: "2",
    category: "博客大赛",
    date: '二天前'
  },
  {
    title: "你的能力和态度及格了吗",
    id: "3",
    category: "博客大赛",
    date: '三天前'
  },
  {
    title: "5分钟让你学会高效组织结构-全功能团队，没学会请自己找原因！",
    id: "4",
    category: "博客大赛",
    date: '三天前'
  },
  {
    title: "微信小程序技术原理与开发框架评析",
    id: "5",
    category: "博客大赛",
    date: '三天前'
  },
  {
    title: "如果你想转岗做BA",
    id: "6",
    category: "博客大赛",
    date: '一周前'
  },
];

const tagMap = {
  newsletter: '新闻',
  blog: '博客大赛',
  admin: 'Admin',
  activity: '活动'
};

const generateArticle = (page: number, size: number, total: number, tag: string) => {
  const _size = (page * size > total) ? total % size : size;
  return [...new Array(_size)].map(() => {
    const article = articleMock[Math.floor(Math.random() * 6)];
    return {
      ...article,
      title: `第${page}页-${article.title}`,
      id: Math.floor(Math.random() * 10000).toString(),
      category: tagMap[tag] || '其他',
    } as IArticlePb;
  });
};

export const mockArticle: MockData[] = [
  {
    request: ArticleModuleRequest,
    response: () =>
      ArticleModuleResponse.create({
        modules: articleModuleMock
      }),
  }, {
    request: ArticleListRequest,
    response: (req: ArticleListRequest) => {
      const { page = 1, size = 5 } = req.pageable;
      const currIndex = (page - 1) * size;
      if (currIndex < pagingMock.totalCount) {
        return ArticleListResponse.create({
          module: req.module,
          entries: generateArticle(page, size, pagingMock.totalCount, req.module),
          pageable: simulatePagination(page, size, pagingMock.totalCount),
        });
      }
      return ArticleListResponse.create({
        module: req.module,
        entries: [],
        pageable: simulatePagination(page, size, pagingMock.totalCount),
      });

    },
    delay: 1000,
  }
];
