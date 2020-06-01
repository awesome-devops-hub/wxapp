import Data = WechatMiniprogram.Component.Data;
import Property = WechatMiniprogram.Component.Property;
import Method = WechatMiniprogram.Component.Method;
import OtherOption = WechatMiniprogram.Component.OtherOption;
import Lifetimes = WechatMiniprogram.Component.Lifetimes;
import PropertyOption = WechatMiniprogram.Component.PropertyOption;
import MethodOption = WechatMiniprogram.Component.MethodOption;

export interface ComponentData {
}

export interface ComponentProperty extends PropertyOption {
}

export interface ComponentMethod extends MethodOption {
}

export interface WxComponent<TData, TProperty extends PropertyOption, TMethod extends MethodOption>
    extends Data<TData>, Property<TProperty>, Method<TMethod>, OtherOption, Lifetimes {
}

export class WxComponent<TData, TProperty, TMethod> {

    readonly data: Readonly<TData> = {} as TData;

    readonly properties: Readonly<TProperty> = {} as TProperty;

    readonly methods: Readonly<TMethod> = {} as TMethod;
}
