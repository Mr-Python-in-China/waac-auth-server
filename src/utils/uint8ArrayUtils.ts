export function toBase64(data: Uint8Array) {
  return btoa(String.fromCharCode(...data));
}
export function toHex(data: Uint8Array) {
  return Array.from(data)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
