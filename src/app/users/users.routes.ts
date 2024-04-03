import { Router } from "express";
import { isLoggedIn } from "../../middlewares/isLoggedIn";
import { UsersController } from "./users.controller";

const router = Router();
const usersController = new UsersController();

router.route("/profile").get(
    isLoggedIn,
    usersController.getProfile
    /*
        #swagger.tags = ['Users Routes']
    */
);

export default router;
