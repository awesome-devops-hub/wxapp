import { MockData } from "../Mock";
import { ArticleModuleRequest, ArticleModuleResponse } from "../../protocol/ArticleProto";

// const pagerMock = {
//   page: 1,
//   size: 5,
//   totalCount: 18,
//   totalPage: 4,
// };

const articleModuleMock = [{
  title: '新闻',
  id: 'news'
},{
  title: '博客',
  id: 'blog'
},{
  title: '八卦',
  id: 'gossip'
},{
  title: '活动',
  id: 'activity'
},{
  title: '更新',
  id: 'updates'
}];

export const mockArticle: MockData[] = [
  {
    request: ArticleModuleRequest,
    response: () =>
      ArticleModuleResponse.create({
        modules: articleModuleMock
      }),
  }
];
