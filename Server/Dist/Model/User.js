"use strict";
/**
 * For Permanent Users
 */
// import mongoose from "mongoose";
//
// interface IUser {
//     _id: mongoose.Types.ObjectId;
//     username: string;
// }
//
// interface IUserMethods {
// }
//
// interface IUserModel extends mongoose.Model<IUser, {}, IUserMethods> {
//     CreateWithDefaultUsername(): Promise<mongoose.HydratedDocument<IUser, IUserMethods>>;
//
//     FindById(id: string): mongoose.Query<mongoose.HydratedDocument<IUser, IUserMethods>, mongoose.HydratedDocument<IUser, IUserMethods>>;
//
//     FindById(id: string): mongoose.Query<mongoose.HydratedDocument<IUser, IUserMethods> | null, mongoose.HydratedDocument<IUser, IUserMethods>, IUser>;
// }
//
// const UserSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>(
//     {
//         username: {
//             type: String,
//             trim: true,
//             minlength: 2,
//             get: ([x, ...y]: [string, string[]]) => x.toUpperCase() + y.join('')
//         },
//     }
// );
//
// UserSchema.static('CreateWithDefaultUsername', async function () {
//     const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
//     const user: IUser = {
//         _id: id,
//         username: `user-${ id.toString() }`,
//     }
//     return await this.create(user);
// });
//
// UserSchema.static('FindById', function (id: string) {
//     return this.findOne({ _id: id });
// });
//
// export const User: IUserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);
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
exports.Users = exports.User = void 0;
const Helper_1 = require("../Helper");
/**
 * For Temporary Users
 */
class User {
    constructor(id, name = "") {
        this.id = id;
        this.name = name;
        this.isActive = true;
        this.isSpectating = false;
        this.isBanned = false;
        this.count = 0;
    }
}
exports.User = User;
class Users {
    static GenerateNewId() {
        let h = (0, Helper_1.hash)(this.Count);
        const id = [];
        for (let i = 0; i < this.MaximumNameLength; i += 1) {
            id.push(`${h % 10}`);
            h = (h / 10) | 0;
        }
        this.Count += 1;
        return id.join("");
    }
}
_a = Users;
Users.Count = Math.floor(Math.random() * 9001) | 0;
Users.Users = {};
Users.MaximumNameLength = 9;
Users.Create = () => __awaiter(void 0, void 0, void 0, function* () {
    let id = _a.GenerateNewId();
    if (yield _a.GetUser(id))
        id = _a.GenerateNewId();
    const user = new User(id);
    _a.Users[id] = user;
    // await Redis.Set<User>(id, user);
    return user;
});
Users.GetUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await Redis.Get<User>(id);
    const user = _a.Users[id];
    return user !== null && user !== void 0 ? user : undefined;
});
Users.Name = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await Redis.Get<User>(id);
    // if (user) return new User(user.id, name);
    return undefined;
});
exports.Users = Users;
//# sourceMappingURL=User.js.map