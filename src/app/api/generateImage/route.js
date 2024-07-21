import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import axios from "axios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 55;

// Sett opp OpenAI-klienten
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Sørg for å sette OPENAI_API_KEY i miljøvariablene dine
});

export async function POST(request) {
  console.log("Mottatt POST-forespørsel for å generere bilde");

  try {
    const { prompt } = await request.json();

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

    // Lagre bildet i mappen "images" under "public"
    const imageName = `image-${Date.now()}.png`;
    const imagePath = path.join(process.cwd(), "public", "images", imageName);

    fs.writeFileSync(imagePath, buffer);

    const imageUrlPath = `/images/${imageName}`;

    console.log("Bilde lagret på:", imageUrlPath);

    return NextResponse.json({ imageUrl: imageUrlPath });
  } catch (error) {
    console.error("Feil ved kall til OpenAI:", error);
    return NextResponse.json(
      { error: "Feil ved kall til OpenAI" },
      { status: 500 }
    );
  }
}
