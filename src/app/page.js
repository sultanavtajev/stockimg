import ClientComponent from "@/components/client";
import axios from "axios";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fetchImagesFromCloudinary() {
  try {
    const result = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: process.env.CLOUDINARY_FOLDER,
      max_results: 100,
    });

    return result.resources.map((file) => file.secure_url);
  } catch (error) {
    console.error("Failed to fetch images from Cloudinary:", error);
    return [];
  }
}

export default async function Home() {
  const initialImages = await fetchImagesFromCloudinary();

  return (
    <main className="flex-1">
      <section className="w-full py-12">
        <div className="container items-center justify-center px-4 md:px-6">
          <ClientComponent initialImages={initialImages} />
        </div>
      </section>
    </main>
  );
}
