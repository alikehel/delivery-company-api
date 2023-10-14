import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { UserModel } from "./user.model";
// import { UserUpdateSchema } from "../validation";

const userModel = new UserModel();

export const getAllUsers = catchAsync(async (req, res) => {
    const usersCount = await userModel.getUsersCount();
    const pagesCount = Math.ceil(usersCount / 10);

    let page = 1;
    if (
        req.query.page &&
        !Number.isNaN(+req.query.page) &&
        +req.query.page > 0
    ) {
        page = +req.query.page;
    }
    if (page > pagesCount) {
        throw new AppError("Page number out of range", 400);
    }
    const take = page * 10;
    const skip = (page - 1) * 10;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const users = await userModel.getAllUsers(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: users
    });
});

// export const getUser = catchAsync(async (req, res) => {
//     const subdomain = req.params.organization;
//     const userID = req.params["userID"];

//     const user = await userModel.getUser(subdomain, userID);

//     res.status(200).json({
//         status: "success",
//         data: user
//     });
// });

// export const updateUser = catchAsync(async (req, res) => {
//     console.log("userData");
//     const subdomain = req.params.organization;
//     const userID = req.params["userID"];

//     const loggedInUserID = res.locals.user.id;
//     const userType = res.locals.user.role;

//     let userData = UserUpdateSchema.parse(req.body);

//     if (userType === "STUDENT") {
//         if (loggedInUserID !== userID) {
//             throw new AppError("You are not the owner of this user!", 401);
//         }
//         if (userData.role) {
//             userData = { ...userData, role: undefined };
//             // throw new AppError("You cannot change your role!", 400);
//         }
//         if (userData.courses) {
//             userData = { ...userData, courses: undefined };
//             // throw new AppError("You cannot enroll in courses!", 400);
//         }
//     } else if (userType === "TEACHER") {
//         if (userData.role) {
//             userData = { ...userData, role: undefined };
//             // throw new AppError("You cannot change the role!", 400);
//         }
//     }

//     if (userData.courses) {
//         const enrolledCourses = await userModel.getEnrolledCourses(
//             subdomain,
//             userID
//         );
//         if (enrolledCourses) {
//             for (const course of userData.courses) {
//                 const coursePrerequisites =
//                     await courseModel.getCoursePrerequisites(subdomain, course);

//                 if (coursePrerequisites && coursePrerequisites.prerequisites) {
//                     for (const prerequisite of coursePrerequisites.prerequisites) {
//                         if (
//                             !enrolledCourses.includes(prerequisite) &&
//                             !userData.courses.includes(prerequisite.code)
//                         ) {
//                             throw new AppError(
//                                 "The student does not have the prerequisites for this course!",
//                                 400
//                             );
//                         }
//                     }
//                 }
//             }
//         }
//     }

//     const user = await userModel.updateUser(subdomain, userID, userData);

//     res.status(200).json({
//         status: "success",
//         data: user
//     });
// });

// export const deleteUser = catchAsync(async (req, res) => {
//     const subdomain = req.params.organization;
//     const userID = req.params["userID"];

//     await userModel.deleteUser(subdomain, userID);

//     res.status(200).json({
//         status: "success"
//     });
// });
