"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
const Log_1 = __importDefault(require("../Middleware/Log"));
const Locals_1 = __importDefault(require("../Provider/Locals"));
class Exception {
    static NotFoundHandler(express) {
        // const prefix = Locals.Config().apiPrefix;
        //
        // express.use('*', (req: Request, res: Response) => {
        //     consola.info(req.socket.remoteAddress);
        //     let ip: string | undefined = req.socket.remoteAddress;
        //     ip &&= ip?.substring(7);
        //     Log.Error(`Path '${ req.originalUrl }' not found [IP: '${ ip }']!`);
        //     // if (req.xhr || req.originalUrl.includes(`/${ prefix }/`)) {
        //     // return res.json({
        //     //     error: 'Page Not Found'
        //     // });
        //     // }
        // });
        return express;
    }
    static ClientErrorHandler(err, req, res, next) {
        Log_1.default.Error(err.stack || 'Unknown error');
        return req.xhr ? res.status(500).json({ error: 'Something went wrong!' }) : next(err);
    }
    static ErrorHandler(err, req, res, next) {
        Log_1.default.Error(err.stack || 'Unknown error');
        res.status(500);
        const prefix = Locals_1.default.Config().apiPrefix;
        if (req.originalUrl.includes(`/${prefix}/`)) {
            if (err.name && err.name === 'UnauthorizedError') {
                const innerMessage = err.message ? err.message : 'Unknown error';
                return res.json({
                    error: [
                        'Invalid Token!',
                        innerMessage
                    ]
                });
            }
            return res.json({
                error: err
            });
        }
        return res.json({ error: err.stack, title: 'Under Maintenance' });
    }
    static LogErrors(err, req, res, next) {
        Log_1.default.Error(err.stack || 'Unknown error');
        return next(err);
    }
}
exports.Exception = Exception;
//# sourceMappingURL=Exception.js.map