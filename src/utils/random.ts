import { randomBytes } from "crypto";

export function randomUnsignedUUID() {
  return randomBytes(16).toString("hex");
}
