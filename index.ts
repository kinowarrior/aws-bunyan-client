import { ILogger, logFactory } from "aws-bunyan";

// import * as maskPII from "./maskPII";
import { maskPII } from "./maskPII";

const log: ILogger = logFactory.createLogger("MyLogger", { maskPII });

const data = { compiler: "Webpack", language: "Typescript" };
log.debug("Data", data);

process.env.LOG_LEVEL = "DEBUG";

log.debug("Data", data);

log.info("This is the data", data);

const warningError = new Error(
  "Database disconnected unexpectedly. Retrying..."
);

log.warn("Database connection issue", data, warningError);

const fatalError = new Error("Database is offline.");

log.error("Fatal error, aborting.", data, fatalError);

log.info("Phone number, Question & Answer", {
  maskPII: {
    answer: "tablet",
    phonenumber: "080 12345678",
    question: "device type"
  }
});
