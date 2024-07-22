import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 55;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    console.log("Fetching images from Cloudinary...");
    const result = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: process.env.CLOUDINARY_FOLDER,
      max_results: 100,
    });

    const imageUrls = result.resources.map((file) => file.secure_url);
    console.log("Fetched image URLs:", imageUrls);

    return NextResponse.json(imageUrls);
  } catch (error) {
    console.error("Failed to fetch images from Cloudinary:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch images from Cloudinary",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
