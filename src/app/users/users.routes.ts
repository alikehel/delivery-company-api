import { Router } from "express";

// import {
//     deleteUser,
//     getAllUsers,
//     getUser,
//     updateUser
// } from "../controllers/users.controller";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import { getAllUsers } from "./users.controller";

const router = Router();

router.route("/users").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllUsers
    /*
        #swagger.tags = ['Users Routes']

        #swagger.description = 'Must be a teacher or admin'

        #swagger.security = [{
            "bearerAuth": []
        }]
    */
);

// router.route("/users/:userID").get(
//     isLoggedIn,
//     isAutherized(["ADMIN", "TEACHER", "STUDENT"]),
//     getUser
//     /*
//         #swagger.tags = ['Users Routes']

//         #swagger.description = 'Must be a teacher or admin, or student'

//         #swagger.security = [{
//             "bearerAuth": []
//         }]
//     */
// );

// router.route("/:organization/users/:userID").patch(
//     isLoggedIn,
//     isAutherized(["ADMIN", "TEACHER", "STUDENT"]),
//     updateUser
//     /*
//         #swagger.tags = ['Users Routes']

//         #swagger.description = 'Must be a teacher or admin or student'

//         #swagger.security = [{
//             "bearerAuth": []
//         }]
//     */
// );

// router.route("/users/:userID").delete(
//     isLoggedIn,
//     isAutherized(["ADMIN"]),
//     deleteUser
//     /*
//         #swagger.tags = ['Users Routes']

//         #swagger.description = 'Must be an admin'

//         #swagger.security = [{
//             "bearerAuth": []
//         }]
//     */
// );

// // router.route("/:organization/users/:userID/profile-image").put(
// //     isLoggedIn,
// //     isAutherized(["ADMIN", "TEACHER", "STUDENT"]),
// //     upload.single("image"),
// //     updateProfilePicture
// //     /*
// //         #swagger.tags = ['Users Routes']

// //         #swagger.description = 'Must be a teacher or admin or student'

// //         #swagger.security = [{
// //             "bearerAuth": []
// //         }]
// //     */
// // );

export default router;
