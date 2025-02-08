import sharp from "sharp";

export async function processSkinTexture(data: Uint8Array | ArrayBuffer) {
  try {
    const image = sharp(data, {
      limitInputPixels: 1e7,
    });
    const metadata = await image.metadata();
    if (
      metadata.width !== 64 ||
      (metadata.height !== 64 && metadata.height !== 32)
    )
      return "InvalidSize";
    const pngBuffer = await image.png().toBuffer();
    return Uint8Array.from(pngBuffer);
  } catch (e) {
    if (e instanceof Error)
      if (e.message === "Input image exceeds pixel limit") return "InvalidSize";
    return "InvaildImage";
  }
}

export async function processCapeTexture(data: Uint8Array) {
  try {
    const image = sharp(data, {
      limitInputPixels: 1e7,
    });
    const metadata = await image.metadata();
    if (metadata.width !== 64 || metadata.height !== 32) return "InvalidSize";
    const pngBuffer = await image.png().toBuffer();
    return Uint8Array.from(pngBuffer);
  } catch (e) {
    if (e instanceof Error)
      if (e.message === "Input image exceeds pixel limit") return "InvalidSize";
    return "InvaildImage";
  }
}
