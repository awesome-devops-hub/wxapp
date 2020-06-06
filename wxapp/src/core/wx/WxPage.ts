import Data = WechatMiniprogram.Page.Data;
import ILifetime = WechatMiniprogram.Page.ILifetime;
import InstanceProperties = WechatMiniprogram.Page.InstanceProperties;
import InstanceMethods = WechatMiniprogram.Component.InstanceMethods;

export interface WxPage<TData> extends Data<TData>, ILifetime, InstanceProperties, InstanceMethods<TData> {
}

export class WxPage<TData> {

    static pageParams = {};

    readonly data: Readonly<TData> = {} as TData;
}
