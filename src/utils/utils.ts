import { hash } from "crypto";

export function saltPassowrd(password: string, salt: Uint8Array) {
  const hashText = Uint8Array.from(hash("SHA-256", password, "buffer"));
  for (let i = 0; i < 16; ++i) hashText[i] ^= salt[i];
  return hashText;
}

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
