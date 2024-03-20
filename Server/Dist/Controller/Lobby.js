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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const Lobbies_1 = require("../Model/Lobbies");
class Lobby {
}
_a = Lobby;
Lobby.Create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const capacity = parseInt(req.query.capacity || "-1", 10);
    const lobby = yield Lobbies_1.Lobbies.Create(capacity);
    return res.json(lobby);
});
Lobby.Get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const lobby = yield Lobbies_1.Lobbies.GetLobby(req.query.lobby);
    if (lobby)
        return res.json(lobby);
    return res.status(404).send(`Lobby ${req.query.name} not found`);
});
exports.Lobby = Lobby;
//# sourceMappingURL=Lobby.js.map