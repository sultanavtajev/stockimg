import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 55;

// Sett opp OpenAI-klienten
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Sørg for å sette OPENAI_API_KEY i miljøvariablene dine
});

export async function POST() {
  console.log("Mottatt POST-forespørsel");

  try {
    console.log(
      "Sender forespørsel til OpenAI for å generere en tilfeldig DALL-E prompt..."
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content:
            "Generate a random art prompt across various genres, such as abstract, surreal, impressionist, or minimalist, showcasing creativity and inspiration.",
        },
      ],
      max_tokens: 50,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    });

    console.log("OpenAI respons mottatt:", response);

    if (
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message
    ) {
      console.error("Ugyldig responsstruktur:", response);
      return NextResponse.json(
        { error: "Ugyldig respons fra OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      prompt: response.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error("Feil ved kall til OpenAI:", error);
    return NextResponse.json(
      { error: "Feil ved kall til OpenAI" },
      { status: 500 }
    );
  }
}
