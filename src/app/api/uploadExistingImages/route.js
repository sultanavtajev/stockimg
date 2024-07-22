// API bygget kun for å laste opp eksisterende bilder til Cloudinary
// Last bildene inn i mappen /public/images og kjør denne API-en for å laste dem opp til Cloudinary
// Etter et bilde er lastet opp, vil det bli slettet fra /public/images
// Hvis det er mange bilder, kan det ta litt tid å laste dem opp og serveren kan time ut før prosessen er ferdig
// I så fall kan du kjøre API-en igjen for å laste opp de resterende bildene
// Bruk curl.exe -X POST http://localhost:3000/api/uploadExistingImages for å kjøre API-en lokalt

import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "stockimg", public_id: filename },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

async function uploadExistingImages() {
  const imagesDir = path.join(process.cwd(), "public", "images");

  try {
    const files = await readdir(imagesDir);
    if (files.length === 0) {
      console.log("No existing images found in the public/images directory.");
      return [];
    }

    const uploadPromises = files.map(async (file) => {
      const filePath = path.join(imagesDir, file);
      const buffer = await readFile(filePath);
      console.log(`Uploading existing image: ${file}`);
      const result = await uploadImageToCloudinary(
        buffer,
        path.parse(file).name
      );
      console.log(
        `Existing image uploaded to Cloudinary: ${result.secure_url}`
      );
      await unlink(filePath); // Delete file after upload
      return result.secure_url;
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.error("Failed to upload existing images:", error);
    throw error;
  }
}

export async function POST() {
  try {
    const uploadedImages = await uploadExistingImages();
    return NextResponse.json({ uploadedImages });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload existing images" },
      { status: 500 }
    );
  }
}
