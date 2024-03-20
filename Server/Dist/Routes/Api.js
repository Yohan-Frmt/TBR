"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controller_1 = require("../Controller");
const router = (0, express_1.Router)();
router.route('/').get(Controller_1.Home.index);
exports.default = router;
//# sourceMappingURL=Api.js.map