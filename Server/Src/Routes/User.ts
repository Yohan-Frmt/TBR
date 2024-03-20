import { Router } from "express";
import { User } from "../Controller";

const router = Router();

router.route("/users/new").get(User.Create);
router.route("/users/get").get(User.Get);

export default router;
