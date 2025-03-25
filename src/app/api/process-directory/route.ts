import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Step 1: Fetch the directory and its files
    const directory = await prisma.directory.findUnique({
      where: { id },
      include: {
        files: true,
      },
    });

    if (!directory) {
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 404 }
      );
    }

    // Step 2: Organize files into an object of id and extension
    const filesData = directory.files.map((file) => ({
      id: file.id,
      extension: file.extension,
    }));

    // Step 3: Check if there are any files in the directory
    if (filesData.length === 0) {
      return NextResponse.json(
        { message: "The directory contains no files." },
        { status: 200 }
      );
    }

    // Step 4: Construct a concise prompt for ChatGPT
    const prompt = `
     write abcd
    `;

    // Step 5: Send the prompt to ChatGPT with strict token and temperature constraints
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 20, // Strictly enforce a short response
      temperature: 0.1, // Ensure deterministic and focused responses
    });

    const gptResponse = chatCompletion.choices[0]?.message?.content;

    // Step 6: Validate and return the response
    if (!gptResponse || gptResponse.trim() === "") {
      return NextResponse.json(
        { error: "Unable to generate a response from the model." },
        { status: 500 }
      );
    }

    // Optional: Truncate the response to enforce brevity
    const truncatedResponse = gptResponse.split(".")[0] + "."; // Take only the first sentence

    return NextResponse.json({ message: truncatedResponse });
  } catch (error) {
    console.error("Error processing directory:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
