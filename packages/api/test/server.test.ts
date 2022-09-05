import http from 'http';
import createServer from "../src/server";
import createSocketServer from "../src/socket/socket";

jest.mock('http');

jest.mock('../src/socket');

let app: http.Server;

describe('Server checks', () => {

    let createServerMock: any;
    let createSocketServerMock: any;

    beforeEach(() => {
        app = createServer();
        createServerMock = http.createServer;
        createSocketServerMock = createSocketServer;
    });


    it('Server is created withouth errors', () => {
        expect(app).toBeTruthy();
        expect(createServerMock).toHaveBeenCalled();
        expect(createSocketServerMock).toHaveBeenCalled();
    });
});