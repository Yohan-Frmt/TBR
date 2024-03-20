import { Application } from "express";
import Locals from "../Provider/Locals";
import Cors from "./Cors";
import Http from "./Http";
import Monitor from "./Monitor";

class Middleware {
    public static Initialise(express: Application): Application {
        if (Locals.Config().corsEnabled) express = Cors.Enable(express);
        express = Http.Enable(express);
        // express = CsrfToken.Enable(express);
        // express = Statics.Enable(express);
        express = Monitor.Enable(express);
        return express;
    }
}

export default Middleware;
