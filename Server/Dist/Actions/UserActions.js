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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActions = void 0;
const Log_1 = __importDefault(require("../Middleware/Log"));
const Lobbies_1 = require("../Model/Lobbies");
class UserActions {
}
_a = UserActions;
UserActions.Join = (name, userId) => Lobbies_1.Lobbies.JoinLobby(name, userId);
UserActions.Leave = (name, userId) => Lobbies_1.Lobbies.Leave(name, userId);
UserActions.SetName = (lobby, userId, user) => __awaiter(void 0, void 0, void 0, function* () {
    Log_1.default.Info(`Setting the name of ${userId} to ${user.name}`);
    return undefined;
    // return (await Lobbies.Get(lobby))?.Users.find(
    //   ({ id }) => id === userId
    // )?.SetName(user.id, user.name);
});
exports.UserActions = UserActions;
//# sourceMappingURL=UserActions.js.map