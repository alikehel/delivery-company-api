// import multer from "multer";
// import AppError from "../utils/AppError.util";

// export const upload = multer({
//     storage: multer.diskStorage({
//         destination: "uploads/images",
//         filename: function (req, file, cb) {
//             const uniqueSuffix =
//                 Date.now() + "-" + Math.round(Math.random() * 1e9);
//             cb(
//                 null,
//                 file.fieldname +
//                     "-" +
//                     uniqueSuffix +
//                     "." +
//                     file.mimetype.split("/")[1]
//             );
//         }
//     }),
//     limits: { fileSize: 1024 * 1024 * 5 },
//     fileFilter: function (req, file, cb) {
//         const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//         if (!allowedTypes.includes(file.mimetype)) {
//             const error = new AppError("نوع الملف غير مدعوم", 400);
//             return cb(error);
//         }
//         cb(null, true);
//     }
// });
