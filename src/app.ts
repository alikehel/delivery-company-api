import { apiReference } from "@scalar/express-api-reference";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { SwaggerTheme } from "swagger-themes";
import swaggerUi from "swagger-ui-express";

// import { Role } from "@prisma/client";
import globalErrorcontroller from "./error/error.controller";
import { isLoggedIn } from "./middlewares/isLoggedIn.middleware";
import {
    morganMiddleware,
    morganMiddlewareImmediate
} from "./middlewares/morgan.middleware";
import apiRouter from "./routes";
import swaggerDocument from "./swagger/swagger-output.json";
import AppError from "./utils/AppError.util";

const app = express();

// Swagger

const swaggerTheme = new SwaggerTheme("v3");
const swaggerOptionsV1 = {
    explorer: true,
    customCss: swaggerTheme.getBuffer("dark")
};

app.use(
    "/api-docs-dark-theme",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptionsV1)
);

app.use(
    "/api-docs-scalar",
    apiReference({
        spec: {
            content: swaggerDocument
        }
    })
);

// Middlewares

app.use(morganMiddlewareImmediate);
app.use(morganMiddleware);
app.use(bodyParser.json()); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(helmet()); // Set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors()); // Enable CORS - Cross Origin Resource Sharing

// Function to serve all static files
// app.use(express.static("uploads/images"));
app.use("/uploads", express.static("uploads"));
app.use("/storage", express.static("storage"));
app.use(
    "/logs",
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    express.static("logs")
);

// Routes

app.use(
    "/api/v1",
    apiRouter
    /*
        #swagger.responses[200] = {
            description: 'Success',
            schema: { $ref: "#/components/schemas/SuccessResponseSchema" }
        }

        #swagger.responses[400] = {
            description: 'Client Error',
            schema: { $ref: "#/components/schemas/ErrorResponseSchema" }
        }

        #swagger.responses[401] = {
            description: 'Client Error - Unauthorized',
            schema: { $ref: "#/components/schemas/ErrorResponseSchema" }
        }

        #swagger.responses[500] = {
            description: 'Server Error',
            schema: { $ref: "#/components/schemas/ErrorResponseSchema" }
        }
    */
);

app.route("/").get((_req, res) => {
    // #swagger.ignore = true
    res.send("<h1>Hello, World! 🌍 [From Root]</h1>");
});

app.route("/api").get((_req, res) => {
    // #swagger.ignore = true
    res.send("<h1>Hello, World! 🌍 [From API]</h1>");
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

// Global Error Handler

app.use(globalErrorcontroller);

// Export App

export default app;
