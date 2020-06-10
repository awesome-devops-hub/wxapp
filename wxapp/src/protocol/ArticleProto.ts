import * as Webpb from "webpb";

export interface IArticleModuleRequest {
}

export class ArticleModuleRequest implements IArticleModuleRequest, Webpb.WebpbMessage {
  META: () => Webpb.WebpbMeta;

  private constructor() {
    this.META = () => ({
      class: 'ArticleModuleRequest',
      method: 'GET',
      path: `/api/article/modules`
    }) as Webpb.WebpbMeta;
  }

  static create(): ArticleModuleRequest {
    return new ArticleModuleRequest();
  }
}

export interface IArticleModulePb {
  title: string,
  id: string
}

export interface IArticleModuleResponse {
  modules: IArticleModulePb[];
}

export class ArticleModuleResponse implements IArticleModuleResponse {
  modules!: IArticleModulePb[];
  META: () => Webpb.WebpbMeta;

  private constructor(p?: IArticleModuleResponse) {
    Webpb.assign(p, this, []);
    this.META = () => (p && {
      class: 'ArticleModulePb',
      method: '',
      path: ''
    }) as Webpb.WebpbMeta;
  }

  static create(properties: IArticleModuleResponse): ArticleModuleResponse {
    return new ArticleModuleResponse(properties);
  }
}
