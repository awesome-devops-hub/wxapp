export interface Environment {
    env: 'dev' | 'prod';
    host: string;
    localMock: boolean;
}
