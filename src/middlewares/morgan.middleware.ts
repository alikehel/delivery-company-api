import morgan, { StreamOptions } from "morgan";

import Logger from "../lib/logger";

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
    // Use the http severity
    write: (message) => Logger.http(message.replace(/\n$/, ""))
};

// Skip all the Morgan http log if the
// application is not running in dev mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
// const skip = () => {
//     const env = process.env.NODE_ENV || "dev";
//     return env !== "dev";
// };

// Build the morgan middleware
const morganMiddleware = morgan(
    // Define message format string (this is the default one).
    // The message format is made from tokens, and each token is
    // defined inside the Morgan library.
    // You can create your custom token to show what do you want from a request.
    ":method :url :status :res[content-length] - :response-time ms",
    // Options: in this case, I overwrote the stream and the skip logic.
    // See the methods above.
    { stream }
);

export default morganMiddleware;
