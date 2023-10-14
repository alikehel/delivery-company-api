import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
// import morgan from "morgan";
import { SwaggerTheme } from "swagger-themes";
import swaggerUi from "swagger-ui-express";

// import { NODE_ENV } from "./config/config";
import globalErrorcontroller from "./error/error.controller";
import apiRouter from "./routes";
import swaggerDocument from "./swagger/swagger-output.json";
import AppError from "./utils/AppError.util";

const app = express();

const swaggerTheme = new SwaggerTheme("v3");
const swaggerOptionsV1 = {
    explorer: true,
    customCss: swaggerTheme.getBuffer("dark")
};
const swaggerOptionsV2 = {
    explorer: true,
    customCss: swaggerTheme.getBuffer("outline")
};
const swaggerOptionsV3 = {
    explorer: true,
    customCss: swaggerTheme.getBuffer("classic")
};
const swaggerOptionsV4 = {
    explorer: true,
    customCss: swaggerTheme.getBuffer("newspaper")
};
const swaggerOptionsV5 = {
    explorer: true,
    customCss: swaggerTheme.getBuffer("muted")
};

app.use(
    "/api-docs-dark-theme",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptionsV1)
);
app.use(
    "/api-docs-outline-theme",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptionsV2)
);
app.use(
    "/api-docs-classic-theme",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptionsV3)
);
app.use(
    "/api-docs-newspaper-theme",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptionsV4)
);
app.use(
    "/api-docs-muted-theme",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptionsV5)
);
// app.use(
//     "/api-docs",
//     (
//         req: express.Request,
//         res: express.Response,
//         next: express.NextFunction
//     ) => {
//         const theme: SwaggerThemeName =
//             (req.query.theme as SwaggerThemeName) || "classic";
//         const swaggerOptions = {
//             explorer: true,
//             customCss: swaggerTheme.getBuffer(theme)
//         };
//         res.locals.swaggerOptions = swaggerOptions;
//         next();
//     },
//     swaggerUi.serve,
//     // swaggerUi.setup(swaggerDocument, swaggerOptionsV1)
//     (req: express.Request, res: express.Response) => {
//         return async () => {
//             swaggerUi.setup(swaggerDocument, res.locals.swaggerOptions);
//         };
//     }
// );

// MORGAN

// // if (NODE_ENV === "dev") {
// //     app.use(morgan("short"));
// // }

// // Define a custom logging format that includes errors
// const logFormat =
//     ":method :url :status :res[content-length] - :response-time ms";
// const errorLogFormat =
//     ":method :url :status :res[content-length] - :response-time ms :error-message";

// // Log all requests with the custom format
// app.use(morgan(logFormat));

// // // Error handling middleware to log errors
// // app.use((err, req, res, next) => {
// //     // Add the error message to the request object
// //     req["error-message"] = err.message;
// //     next(err);
// // });

// // Log errors with the custom error format
// app.use(
//     morgan(errorLogFormat, {
//         skip: (req, res) => res.statusCode < 400 // Skip logging if status code < 400 (non-error responses)
//     })
// );

// End MORGAN

app.use(bodyParser.json()); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cors()); // Enable CORS - Cross Origin Resource Sharing
app.use(helmet()); // Set security HTTP headers

app.use("/api", apiRouter);

app.route("/").get((_req, res) => {
    // #swagger.ignore = true
    res.send("<h1>Hello, World! 🌍</h1>");
});

app.route("/health").get((_req, res) => {
    // #swagger.ignore = true
    res.sendStatus(200);
});

app.all("*", (req, _res, next) => {
    console.log("err");
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorcontroller);

export default app;
