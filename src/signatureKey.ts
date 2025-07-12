import pem from "pem";
import redis from "./redis";
import { promisify } from "util";
import crypto from "crypto";

await new Promise<void>((resolve) => redis.on("connect", () => resolve()));
const savedKey = await redis.get("signatureKey");
let publicKey: string, privateKey: string;
if (savedKey) {
  const d = savedKey.split(",");
  publicKey = d[0];
  privateKey = d[1];
} else {
  privateKey = (
    await promisify((f: (err: unknown, res: { key: string }) => void) =>
      pem.createPrivateKey(4096, f)
    )()
  ).key;
  publicKey = (
    await promisify((f: (err: unknown, res: { publicKey: string }) => void) =>
      pem.getPublicKey(privateKey, f)
    )()
  ).publicKey;
  await redis.set("signatureKey", `${publicKey},${privateKey}`);
}

export { publicKey, privateKey };

export function signString(message: string): string {
  const signer = crypto.createSign("RSA-SHA1");
  signer.update(message);
  signer.end();
  return signer.sign(privateKey, "base64");
}
