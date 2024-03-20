"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controller_1 = require("../Controller");
const router = (0, express_1.Router)();
router.route("/users/new").get(Controller_1.User.Create);
router.route("/users/get").get(Controller_1.User.Get);
exports.default = router;
//# sourceMappingURL=User.js.map