import {
    HelloRequest,
    HelloResponse,
    UserMpLoginRequest,
    UserMpLoginResponse
} from '../../protocol/UserProto';
import { MockData } from '../Mock';
import { nextRange } from '../Utils';

export const mockDataUser = {
    userId: nextRange(10000, 100000)
};

export const mockUser: MockData[] = [
    {
        request: UserMpLoginRequest,
        response: (res: UserMpLoginRequest) => UserMpLoginResponse.create({
            id: mockDataUser.userId + '',
            token: 'TOKEN-' + res.appId + '-' + mockDataUser.userId
        })
    },
    {
        request: HelloRequest,
        response: () => HelloResponse.create({ message: 'Hello world!' })
    }
];
