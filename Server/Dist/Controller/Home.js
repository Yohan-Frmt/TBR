"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = void 0;
const Lobbies_1 = require("../Model/Lobbies");
class Home {
}
Home.index = (req, res, next) => {
    return res.json({
        title: "Home TSR",
        lobbies: Lobbies_1.Lobbies.Lobbies,
    });
};
exports.Home = Home;
//# sourceMappingURL=Home.js.map