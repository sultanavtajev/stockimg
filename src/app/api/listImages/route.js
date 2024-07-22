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
    const result = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: process.env.CLOUDINARY_FOLDER,
      max_results: 100,
      resource_type: "image",
      direction: "desc",
      sort_by: {
        created_at: "desc",
      },
    });

    const imageUrls = result.resources.map((file) => file.secure_url);

    return NextResponse.json(imageUrls);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list images" },
      { status: 500 }
    );
  }
}
