import app from "./app";
import { PORT } from "./config/config";

const address = `http://localhost:${PORT}`;

const server = app.listen(PORT, () => {
    // if (NODE_ENV === "dev") {
    // eslint-disable-next-line no-console
    console.log(`Starting APP On -> ${address}`);
    // }
});

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, "\n", err.message);
    process.exit(1);
});

process.on("unhandledRejection", (err: Error) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
