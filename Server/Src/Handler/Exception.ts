import { Application, NextFunction, Request, Response } from "express";
import Log from '../Middleware/Log';
import Locals from "../Provider/Locals";

export class Exception {
    public static NotFoundHandler(express: Application): any {
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

    public static ClientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void | Response {
        Log.Error(err.stack || 'Unknown error');
        return req.xhr ? res.status(500).json({ error: 'Something went wrong!' }) : next(err);
    }

    public static ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void | Response {
        Log.Error(err.stack || 'Unknown error');
        res.status(500);

        const prefix: string = Locals.Config().apiPrefix;
        if (req.originalUrl.includes(`/${ prefix }/`)) {
            if (err.name && err.name === 'UnauthorizedError') {
                const innerMessage: string = err.message ? err.message : 'Unknown error';
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

    public static LogErrors(err: Error, req: Request, res: Response, next: NextFunction): void {
        Log.Error(err.stack || 'Unknown error');
        return next(err);
    }
}
