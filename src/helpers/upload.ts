import {NextRequest, NextResponse} from "next/server";
import {join, extname} from "path";
import {stat, mkdir, writeFile, unlink} from "fs/promises";

export async function handleFileUpload(
  req: NextRequest,
  image: any
): Promise<{fileUrl: string; filename: string} | null> {
  try {
    const buffer = Buffer.from(await image.arrayBuffer());
    const relativeUploadDir = `/uploads`;

    const uploadDir = join(process.cwd(), "public", relativeUploadDir);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = extname(image.name);
    const filename = `${image.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}${fileExtension}`;

    try {
      await stat(uploadDir);
    } catch (e) {
      await mkdir(uploadDir, {recursive: true});
    }

    await writeFile(`${uploadDir}/${filename}`, buffer);
    const fileUrl = `${relativeUploadDir}/${filename}`;

    return {fileUrl, filename};
  } catch (error) {
    console.error("Error in handleFileUpload:", error);
    throw error;
  }
}

export async function handleFileUpdate(
  image: any,
  existingImage: any
): Promise<{fileUrl: string; filename: string} | null> {
  try {
    const buffer = Buffer.from(await image.arrayBuffer());
    const relativeUploadDir = `/uploads`;

    const uploadDir = join(process.cwd(), "public", relativeUploadDir);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = extname(image.name);
    const newFilename = `${image.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}${fileExtension}`;

    // Remove existing file
    const existingFilePath = existingImage;
    const existingFilename = existingFilePath.split("/").pop(); 
    await unlink(join(uploadDir, existingFilename));

    // Upload new file
    try {
      await stat(uploadDir);
    } catch (e) {
      await mkdir(uploadDir, {recursive: true});
    }

    await writeFile(`${uploadDir}/${newFilename}`, buffer);
    const newFileUrl = `${relativeUploadDir}/${newFilename}`;

    return {fileUrl: newFileUrl, filename: newFilename};
  } catch (error) {
    console.error("Error in handleFileUpdate:", error);
    throw error;
  }
}
