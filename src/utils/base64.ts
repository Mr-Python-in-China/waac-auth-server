export function toBase64(data: Uint8Array) {
  return btoa(String.fromCharCode(...data));
}
