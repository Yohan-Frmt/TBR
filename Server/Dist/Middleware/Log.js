"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consola_1 = __importDefault(require("consola"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Log {
    constructor() {
        this.today = new Date();
        this.Info = (str) => {
            consola_1.default.info("\x1b[36m%s\x1b[0m", str);
            this.Add("INFO", str);
        };
        this.Warn = (str) => {
            consola_1.default.info("\x1b[33m%s\x1b[0m", str);
            this.Add("WARN", str);
        };
        this.Error = (str) => {
            consola_1.default.error("\x1b[31m%s\x1b[0m", str);
            this.Add("ERROR", str);
        };
        this.Custom = (filename, str) => {
            this.Add(filename, str);
        };
        this.Add = (kind, str) => {
            fs.open(`${this.baseDir}${this.fileName}`, "a", (err, fd) => {
                if (!err && fd)
                    fs.appendFile(fd, `${this.linePrefix} [${kind.toUpperCase()}] ${str}\n`, (err) => {
                        if (!err)
                            fs.close(fd, (err) => !err
                                ? true
                                : consola_1.default.error("\x1b[31m%s\x1b[0m", `Error closing log file that was being appended`));
                        else
                            return consola_1.default.error("\x1b[31m%s\x1b[0m", `[Error] Error appending to the log file`);
                    });
                else
                    return consola_1.default.error("\x1b[31m%s\x1b[0m", `[Error] Error couldn't open the log file for appending`);
            });
        };
        const date = `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate()}`;
        const time = `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`;
        this.baseDir = path.join(__dirname, "../../.logs/");
        this.fileName = `${date}.log`;
        this.linePrefix = `[${date} ${time}]`;
    }
}
exports.default = new Log();
//# sourceMappingURL=Log.js.map