"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_1 = __importDefault(require("./socket/socket"));
function createServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../app/build')));
    app.use((req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../../app/build/index.html'));
    });
    const server = http_1.default.createServer(app);
    (0, socket_1.default)(server);
    return app;
}
exports.default = createServer;
