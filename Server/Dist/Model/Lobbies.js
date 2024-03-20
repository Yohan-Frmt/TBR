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
exports.Lobbies = void 0;
const Helper_1 = require("../Helper");
const Lobby_1 = require("./Lobby");
const NameGenerator_1 = require("./NameGenerator");
class Lobbies {
    static GenerateNewName() {
        let h = (0, Helper_1.hash)(this.Count);
        const name = [];
        for (let i = 0; i < this.MaximumNameLength; i += 1) {
            name.push(String.fromCharCode("A".charCodeAt(0) + (h % 26)));
            h = (h / 26) | 0;
        }
        this.Count += 1;
        return name.join("");
    }
}
_a = Lobbies;
Lobbies.Count = Math.floor(Math.random() * 9001) | 0;
Lobbies.Lobbies = {};
Lobbies.MaximumNameLength = 4;
// private static FromRedis = (str: TLobby): Lobby => new Lobby(str.name, str.capacity, str.Users, str.isPrivate);
Lobbies.Create = (capacity = -1) => __awaiter(void 0, void 0, void 0, function* () {
    let name = NameGenerator_1.NameGenerator.GenerateNewName();
    const lobby = new Lobby_1.Lobby(name, capacity);
    _a.Lobbies[name] = lobby;
    // await Redis.Set<Lobby>(name, lobby);
    return lobby;
});
Lobbies.Delete = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const lobby = yield _a.GetLobby(name);
    if (lobby)
        delete _a.Lobbies[name];
    // if (lobby) await Redis.Delete(name);
});
Lobbies.GetLobby = (name) => __awaiter(void 0, void 0, void 0, function* () {
    // const desiredLobby = await Redis.Get<Lobby>(name);
    console.log("GET LOBBY : ", name);
    console.log("GET LOBBY : ", _a.Lobbies);
    const desiredLobby = _a.Lobbies[name];
    return desiredLobby;
    // return desiredLobby ? this.FromRedis(desiredLobby) : null;
});
Lobbies.GetUsers = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const lobby = yield _a.GetLobby(name);
    return lobby === null || lobby === void 0 ? void 0 : lobby.GetUsers();
});
Lobbies.JoinLobby = (lobbyName, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const lobby = yield _a.GetLobby(lobbyName);
    return lobby === null || lobby === void 0 ? void 0 : lobby.Join(userId);
});
Lobbies.Leave = (lobbyName, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const lobby = yield _a.GetLobby(lobbyName);
    return lobby === null || lobby === void 0 ? void 0 : lobby.Leave(userId);
});
Lobbies.IsBannedFromLobby = (lobby, userId) => { var _b; return (_b = _a.GetUserInLobby(lobby, userId)) === null || _b === void 0 ? void 0 : _b.isBanned; };
Lobbies.CanPlay = (lobby) => lobby.isPrivate
    ? false
    : lobby.capacity < 0 ||
        _a.GetUsersInLobby(lobby).players.length < lobby.capacity;
Lobbies.GetUserInLobby = (lobby, userId) => {
    const idx = lobby.Users.findIndex(({ id }) => id === userId);
    return idx >= 0 ? lobby.Users[idx] : undefined;
};
Lobbies.GetUsersInLobby = (lobby) => {
    const players = [];
    const inactives = [];
    const banned = [];
    const spectators = [];
    for (const user of lobby.Users) {
        if (user.isBanned)
            banned.push(user);
        else if (!user.isActive)
            inactives.push(user);
        else if (user.isSpectating)
            spectators.push(user);
        else
            players.push(user);
    }
    return {
        players,
        inactives,
        banned,
        spectators,
    };
};
exports.Lobbies = Lobbies;
//# sourceMappingURL=Lobbies.js.map