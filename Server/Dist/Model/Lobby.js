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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const User_1 = require("./User");
class Lobby {
    constructor(name, capacity = -1) {
        this.name = name;
        this.capacity = capacity;
        this.Users = [];
        this.isPrivate = true;
        this.GetUser = (userId) => {
            const idx = this.Users.findIndex(({ id }) => id === userId);
            return idx >= 0 ? this.Users[idx] : undefined;
        };
        this.IsBanned = (userId) => { var _a; return (_a = this.GetUser(userId)) === null || _a === void 0 ? void 0 : _a.isBanned; };
        this.Join = (userId) => __awaiter(this, void 0, void 0, function* () {
            if (this.IsBanned(userId))
                return undefined;
            const idx = this.Users.findIndex(({ id }) => id === userId);
            const user = idx >= 0 ? this.Users[idx] : new User_1.User(userId);
            if (idx >= 0 && !user.isActive)
                this.Users.splice(idx, 1);
            if (idx < 0 && user.isActive) {
                if (!(yield this.CanPlay()))
                    user.isSpectating = true;
                this.Users.push(user);
            }
            user.isActive = true;
            user.count += 1;
            // this.promoteSpectator();
            return user;
        });
        this.Leave = (userId) => {
            if (this.IsBanned(userId))
                return undefined;
            const index = this.Users.findIndex(({ id }) => id === userId);
            if (index < 0)
                return undefined;
            const user = this.Users[index];
            if (!user.isActive)
                return undefined;
            user.count -= 1;
            if (user.count === 0)
                user.isActive = false;
            // this.promoteSpectator();
            return user;
        };
        this.CanPlay = () => __awaiter(this, void 0, void 0, function* () { return !this.isPrivate && (this.capacity < 0 || (yield this.GetUsers()).players.length < this.capacity); });
    }
    GetUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const players = [];
            const inactives = [];
            const banned = [];
            const spectators = [];
            console.log("GET USERS : ", this.Users);
            for (const { id, isActive, isSpectating, isBanned } of this.Users) {
                const user = yield User_1.Users.GetUser(id);
                console.log("GetUsers");
                if (user) {
                    if (banned)
                        banned.push(user);
                    else if (!isActive)
                        inactives.push(user);
                    else if (isSpectating)
                        spectators.push(user);
                    else
                        players.push(user);
                }
            }
            return { players, inactives, spectators, banned };
        });
    }
}
exports.Lobby = Lobby;
//
// interface ILobbyMethods {}
//
// interface ILobby {
//   _id: mongoose.Types.ObjectId;
//   name: string;
// }
//
// interface ILobbyModel extends mongoose.Model<ILobby, {}, ILobbyMethods> {
//   Create(): Promise<mongoose.HydratedDocument<ILobby, ILobbyMethods>>;
//
//   FindByName(
//     id: string
//   ): mongoose.Query<
//     mongoose.HydratedDocument<ILobby, ILobbyMethods> | null,
//     mongoose.HydratedDocument<ILobby, ILobbyMethods>,
//     ILobby
//   >;
// }
//
// const LobbySchema = new mongoose.Schema<ILobby, ILobbyModel, ILobbyMethods>({
//   name: {
//     type: String,
//     trim: true,
//     minlength: 2,
//     get: ([x, ...y]: [string, string[]]) => x.toUpperCase() + y.join(""),
//   },
// });
//
// LobbySchema.static("CreateWithName", async function (name: string) {
//   const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
//   const lobby: ILobby = {
//     _id,
//     name,
//   };
//
//   return await this.create(lobby);
// });
//
// LobbySchema.static("FindByName", function (name: string) {
//   return this.findOne({ name });
// });
//# sourceMappingURL=Lobby.js.map