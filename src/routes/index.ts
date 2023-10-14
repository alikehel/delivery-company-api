import { Router } from "express";

import catchAsync from "../utils/catchAsync.util";

import authRoutes from "../app/auth/auth.routes";
import repositoriesRoutes from "../app/repositories/repositories.routes";
import usersRoutes from "../app/users/users.routes";

const router = Router();

router.use("/", authRoutes);
router.use("/", usersRoutes);
router.use("/", repositoriesRoutes);

/*******************************************************************************
 * TEST ROUTES
 * TODO: Remove these routes
 *******************************************************************************/

router.route("/test").post(
    catchAsync(async (req, res) => {
        // #swagger.ignore = true
        res.status(200).json({
            status: "success",
            data: "response"
        });
    })
);

//*******************************************************************************//

export default router;
