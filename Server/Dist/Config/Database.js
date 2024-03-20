"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const mongoose_1 = __importDefault(require("mongoose"));
const Log_1 = __importDefault(require("../Middleware/Log"));
const Locals_1 = __importDefault(require("../Provider/Locals"));
class Database {
    static Initialise() {
        var _a;
        const url = (_a = Locals_1.default.Config().mongooseUrl) !== null && _a !== void 0 ? _a : "";
        mongoose_1.default.Promise = bluebird_1.default;
        mongoose_1.default
            .connect(url)
            .then(() => {
            Log_1.default.Info(`[Database] Connected to Mongo Database at : ${url}`);
        })
            .catch((err) => {
            Log_1.default.Error(`[Error] Error while connecting to Mongo Database : ${err.message}`);
            throw err;
        });
    }
}
exports.Database = Database;
exports.default = mongoose_1.default;
//# sourceMappingURL=Database.js.map