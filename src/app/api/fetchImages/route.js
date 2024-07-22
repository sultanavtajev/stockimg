import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: process.env.CLOUDINARY_FOLDER,
      max_results: 1000,
    });

    // Extract the image URLs and sort them by filename in descending order
    const imageUrls = result.resources
      .sort((a, b) => b.public_id.localeCompare(a.public_id))
      .map((file) => file.secure_url);

    console.log("Fetched and sorted image URLs:", imageUrls);

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
