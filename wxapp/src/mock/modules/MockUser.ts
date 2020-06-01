import { MockData } from '../Mock';
import {
    HelloRequest,
    HelloResponse,
    UserMpLoginRequest,
    UserMpLoginResponse
} from '../../protocol/UserProto';

const USER_ID = 100001;
export const mockUser: MockData[] = [
    {
        request: UserMpLoginRequest,
        response: () => UserMpLoginResponse.create({
            id: USER_ID + '',
            token: 'TOKEN-' + USER_ID
        })
    },
    {
        request: HelloRequest,
        response: () => HelloResponse.create({ message: 'Hello world!' })
    }
];
