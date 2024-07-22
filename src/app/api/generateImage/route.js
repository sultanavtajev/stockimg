import { NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";
import cloudinary from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 55;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  console.log("Mottatt POST-forespørsel for å generere bilde");

  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt");

    if (!prompt) {
      console.error("Ingen prompt funnet i forespørselen");
      return NextResponse.json(
        { error: "Ingen prompt funnet i forespørselen" },
        { status: 400 }
      );
    }

    console.log(
      "Sender forespørsel til OpenAI for å generere bilde med DALL-E..."
    );

    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    console.log("OpenAI respons mottatt:", response);

    if (!response.data || !response.data[0] || !response.data[0].url) {
      console.error("Ugyldig responsstruktur:", response.data);
      return NextResponse.json(
        { error: "Ugyldig respons fra OpenAI" },
        { status: 500 }
      );
    }

    const imageUrl = response.data[0].url;

    // Last ned bildet
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(imageResponse.data, "binary");

    // Last opp bildet til Cloudinary
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: process.env.CLOUDINARY_FOLDER },
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

      console.log("Bilde lastet opp til Cloudinary:", result.secure_url);

      return NextResponse.json({ imageUrl: result.secure_url });
    } catch (uploadError) {
      console.error("Feil ved opplasting til Cloudinary:", uploadError);
      return NextResponse.json(
        { error: "Feil ved opplasting til Cloudinary" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Feil ved kall til OpenAI:", error);
    return NextResponse.json(
      { error: "Feil ved kall til OpenAI" },
      { status: 500 }
    );
  }
}
