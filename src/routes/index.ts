import { Router } from "express";

import catchAsync from "../utils/catchAsync.util";

import authRoutes from "../app/auth/auth.routes";
import branchesRoutes from "../app/branches/branches.routes";
import clientsRoutes from "../app/clients/clients.routes";
import locationsRoutes from "../app/locations/locations.routes";
import ordersRoutes from "../app/orders/orders.routes";
import productsRoutes from "../app/products/products.routes";
import repositoriesRoutes from "../app/repositories/repositories.routes";
import tenantsRoutes from "../app/tenants/tenants.routes";
import usersRoutes from "../app/users/users.routes";

const router = Router();

router.use("/", authRoutes);
router.use("/", usersRoutes);
router.use("/", repositoriesRoutes);
router.use("/", clientsRoutes);
router.use("/", branchesRoutes);
router.use("/", locationsRoutes);
router.use("/", tenantsRoutes);
router.use("/", ordersRoutes);
router.use("/", productsRoutes);

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
