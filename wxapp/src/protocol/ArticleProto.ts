import * as Webpb from "webpb";
import * as ResourceProto from "./ResourceProto";

// interfaces
// requests
export interface IArticleModuleRequest {}

export interface IArticleListRequest {
  module: string;
  pageable: ResourceProto.IPageablePb;
}

// responses
export interface IArticlePb {
  id: string;
  title: string;
  coverImage: string;
  category?: string;
  date?: string;
}

export interface IArticleModulePb {
  title: string;
  id: string;
}

export interface IArticleModuleResponse {
  modules: IArticleModulePb[];
}

export interface IArticleListResponse {
  module: string;
  entries: IArticlePb[];
  pageable: ResourceProto.IPagingPb;
}

// article modules
export class ArticleModuleRequest
  implements IArticleModuleRequest, Webpb.WebpbMessage {
  META: () => Webpb.WebpbMeta;

  private constructor() {
    this.META = () =>
      ({
        class: "ArticleModuleRequest",
        method: "GET",
        path: `/api/article/modules`,
      } as Webpb.WebpbMeta);
  }

  static create(): ArticleModuleRequest {
    return new ArticleModuleRequest();
  }
}

export class ArticleModuleResponse implements IArticleModuleResponse {
  modules!: IArticleModulePb[];
  META: () => Webpb.WebpbMeta;

  private constructor(p?: IArticleModuleResponse) {
    Webpb.assign(p, this, []);
    this.META = () =>
      (p && {
        class: "ArticleModulePb",
        method: "",
        path: "",
      }) as Webpb.WebpbMeta;
  }

  static create(properties: IArticleModuleResponse): ArticleModuleResponse {
    return new ArticleModuleResponse(properties);
  }
}

// articles
export class ArticleListRequest
  implements IArticleListRequest, Webpb.WebpbMessage {
  module!: string;
  pageable!: ResourceProto.IPageablePb;
  META: () => Webpb.WebpbMeta;

  private constructor(p?: IArticleListRequest) {
    Webpb.assign(p, this);
    this.META = () =>
      (p && {
        class: "ArticleListRequest",
        method: "GET",
        path: `/api/articles${Webpb.query({
          page: Webpb.getter(p, "pageable.page"),
          size: Webpb.getter(p, "pageable.size"),
          module: p.module,
        })}`,
      }) as Webpb.WebpbMeta;
  }

  static create(p: IArticleListRequest): ArticleListRequest {
    return new ArticleListRequest(p);
  }
}

export class ArticleListResponse implements IArticleListResponse {
  module: string;
  entries: IArticlePb[];
  pageable: ResourceProto.IPagingPb;
  META: () => Webpb.WebpbMeta;

  private constructor(p?: IArticleListResponse) {
    Webpb.assign(p, this, []);
    this.META = () =>
      (p && {
        class: "ArticleListResponse",
        method: "",
        path: "",
      }) as Webpb.WebpbMeta;
  }

  static create(properties: IArticleListResponse): ArticleListResponse {
    return new ArticleListResponse(properties);
  }
}
