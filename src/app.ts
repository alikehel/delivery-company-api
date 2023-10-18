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
// import Logger from "./lib/logger";
import {
    morganMiddleware,
    morganMiddlewareImmediate
} from "./middlewares/morgan.middleware";
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

app.use(morganMiddlewareImmediate);
app.use(morganMiddleware);
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
    // #swagger.ignore = true
    // Logger.error(`Can't find ${req.originalUrl} on this server!`);
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorcontroller);

export default app;
