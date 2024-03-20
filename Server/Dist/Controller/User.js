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
exports.User = void 0;
const User_1 = require("../Model/User");
class User {
}
_a = User;
User.Create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.Users.Create();
    return res.json(user);
});
User.Get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.Users.GetUser(req.query.userId);
    if (user)
        return res.json(user);
    return res.status(404).send(`User ${req.query.userId} not found`);
});
exports.User = User;
//# sourceMappingURL=User.js.map