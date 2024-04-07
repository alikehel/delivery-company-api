import { Router } from "express";
import { isLoggedIn } from "../../middlewares/isLoggedIn";
import { getProfile } from "./users.controller";

const router = Router();

router.route("/profile").get(
    isLoggedIn,
    getProfile
    /*
        #swagger.tags = ['Users Routes']
    */
);

export default router;
