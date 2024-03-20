"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Lobby_1 = require("../Controller/Lobby");
const router = (0, express_1.Router)();
router.route('/lobby/new').get(Lobby_1.Lobby.Create);
router.route('/lobby/get').get(Lobby_1.Lobby.Get);
exports.default = router;
//# sourceMappingURL=Lobby.js.map