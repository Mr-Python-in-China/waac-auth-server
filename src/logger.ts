import winston from "winston";
import Transport from "winston-transport";
const logger = winston.createLogger({
  transports: [
    new Transport({
      log(info, next) {
        (info.level === "error"
          ? console.error
          : info.level === "warn"
          ? console.warn
          : info.level === "info"
          ? console.info
          : console.debug)(info);
        next();
      },
    }),
  ],
});

export default logger;
