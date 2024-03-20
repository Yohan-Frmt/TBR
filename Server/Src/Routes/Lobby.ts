import { Router } from "express";
import { Lobby } from "../Controller/Lobby";

const router = Router();

router.route('/lobby/new').get(Lobby.Create);
router.route('/lobby/get').get(Lobby.Get);

export default router;
