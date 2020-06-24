// Code generated by Webpb compiler, do not edit.
// https://github.com/jg513/webpb

import * as Webpb from 'webpb';

import * as ResourceProto from './ResourceProto';

export interface IMessagePb {
    id: string;
    title: string;
    summary: string;
    unread?: boolean;
}

export class MessagePb implements IMessagePb {
    id!: string;
    title!: string;
    summary!: string;
    unread?: boolean;
    META: () => Webpb.WebpbMeta;

    private constructor(p?: IMessagePb) {
        Webpb.assign(p, this, []);
        this.META = () => (p && {
            class: 'MessagePb',
            method: '',
            path: ''
        }) as Webpb.WebpbMeta;
    }

    static create(properties: IMessagePb): MessagePb {
        return new MessagePb(properties);
    }
}

export interface IMessageRequest {
    pageable: ResourceProto.IPageablePb;
}

export class MessageRequest implements IMessageRequest, Webpb.WebpbMessage {
    pageable!: ResourceProto.IPageablePb;
    META: () => Webpb.WebpbMeta;

    private constructor(p?: IMessageRequest) {
        Webpb.assign(p, this, []);
        this.META = () => (p && {
            class: 'MessageRequest',
            method: 'GET',
            path: `/api/messages${Webpb.query({
                page: Webpb.getter(p, 'pageable.page'),
                size: Webpb.getter(p, 'pageable.size'),
            })}`
        }) as Webpb.WebpbMeta;
    }

    static create(properties: IMessageRequest): MessageRequest {
        return new MessageRequest(properties);
    }
}

export interface IMessageResponse {
    data: IMessagePb[];
    paging: ResourceProto.IPagingPb;
}

export class MessageResponse implements IMessageResponse {
    data!: IMessagePb[];
    paging!: ResourceProto.IPagingPb;
    META: () => Webpb.WebpbMeta;

    private constructor(p?: IMessageResponse) {
        Webpb.assign(p, this, []);
        this.META = () => (p && {
            class: 'MessageResponse',
            method: '',
            path: ''
        }) as Webpb.WebpbMeta;
    }

    static create(properties: IMessageResponse): MessageResponse {
        return new MessageResponse(properties);
    }
}
