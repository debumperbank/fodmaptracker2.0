import sharp from "sharp";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function optimizeUploadedImage(file: File, maxInputBytes: number) {
  if (!allowedImageTypes.has(file.type) || file.size > maxInputBytes) {
    throw new Error("invalid-image");
  }

  try {
    return await sharp(Buffer.from(await file.arrayBuffer()), { failOn: "error" })
      .rotate()
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75, effort: 4 })
      .toBuffer();
  } catch {
    throw new Error("invalid-image");
  }
}
