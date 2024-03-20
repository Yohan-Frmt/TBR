"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketActions = void 0;
const ws_1 = require("ws");
const Log_1 = __importDefault(require("../Middleware/Log"));
const Lobbies_1 = require("../Model/Lobbies");
const index_1 = require("./index");
const broadcast = (socketServer, message) => {
    if (!socketServer.clients)
        return;
    socketServer.clients.forEach((client) => {
        if (client.readyState === ws_1.OPEN) {
            console.log(message);
            client.send(JSON.stringify(message));
        }
    });
};
const Users = (socketServer, message, { lobby }) => __awaiter(void 0, void 0, void 0, function* () {
    Log_1.default.Info("Broadcasting user's message");
    const type = "users";
    const payload = yield Lobbies_1.Lobbies.GetUsers(lobby);
    broadcast(socketServer, {
        type,
        payload,
    });
});
const actions = {
    Users,
};
const CallAction = (type, name, lobby, userId, message, socketServer) => {
    Log_1.default.Info(`${lobby}: ${userId}: ${name}`);
    // @ts-ignore
    index_1.classes[type][name](lobby, userId, (message && message.payload) || undefined);
    return actions[type](socketServer, message, { lobby });
};
const CreateEndpointFunction = (type, name) => (socketServer, message, { lobby, userId, }) => {
    return CallAction(type, name, lobby, userId, message, socketServer);
};
const BuildEndpoints = (config, type) => Object.keys(config[type]).reduce((funcs, name) => {
    return Object.assign(Object.assign({}, funcs), { [name]: CreateEndpointFunction(type, name) });
}, {});
const GenerateEndpoints = (config) => Object.keys(config).reduce((functions, type) => {
    const newFuncs = BuildEndpoints(config, type);
    return Object.assign(Object.assign({}, functions), newFuncs);
}, {});
exports.socketActions = GenerateEndpoints(index_1.config);
//# sourceMappingURL=SocketActions.js.map