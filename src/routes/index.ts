import { Router } from "express";

import catchAsync from "../utils/catchAsync.util";

import authRoutes from "../app/auth/auth.routes";
import bannersRoutes from "../app/banners/banners.routes";
import branchesRoutes from "../app/branches/branches.routes";
import categoriesRoutes from "../app/categories/categories.routes";
import clientsRoutes from "../app/clients/clients.routes";
import colorsRoutes from "../app/colors/colors.routes";
import locationsRoutes from "../app/locations/locations.routes";
import notificationsRoutes from "../app/notifications/notifications.routes";
import ordersRoutes from "../app/orders/orders.routes";
import productsRoutes from "../app/products/products.routes";
import repositoriesRoutes from "../app/repositories/repositories.routes";
import sizesRoutes from "../app/sizes/sizes.routes";
import storesRoutes from "../app/stores/stores.routes";
import tenantsRoutes from "../app/tenants/tenants.routes";
import usersRoutes from "../app/users/users.routes";
import { upload } from "../middlewares/upload.middleware";

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
router.use("/", categoriesRoutes);
router.use("/", notificationsRoutes);
router.use("/", colorsRoutes);
router.use("/", sizesRoutes);
router.use("/", storesRoutes);
router.use("/", bannersRoutes);

/*******************************************************************************
 * TEST ROUTES
 * TODO: Remove these routes
 *******************************************************************************/

router.route("/test").post(
    upload.single("avatar"),
    catchAsync(async (req, res) => {
        //  req.file?.destination + "/" + req.file?.filename;
        const imagePath = "/" + req.file?.path.replace(/\\/g, "/");
        // #swagger.ignore = true
        res.status(200).json({
            status: "success",
            data: {
                imagePath
            }
        });
    })
);

//*******************************************************************************//

export default router;
