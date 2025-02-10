import winston from "winston";
import Transport from "winston-transport";

class DebugTransport extends Transport {
  log(info: unknown & { level: string }, next: (...args: unknown[]) => void) {
    setImmediate(() => this.emit("logged", info));
    (info.level === "error"
      ? console.error
      : info.level === "warn"
        ? console.warn
        : info.level === "info"
          ? console.info
          : console.debug)(info);
    next(null, true);
  }
}

const logger = winston.createLogger({
  transports: [
    process.env.NODE_ENV === "development"
      ? new DebugTransport()
      : new winston.transports.Console(),
  ],
});

export default logger;
