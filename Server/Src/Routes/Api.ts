import { Router } from "express";
import { Home } from "../Controller";

const router = Router();

router.route('/').get(Home.index);

export default router;
