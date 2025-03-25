// app/api/process-directory/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
    const { id: id } = await context.params;

  try {
    // Step 1: Fetch all files in the directory
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

    // Step 3: Construct a prompt for ChatGPT
    const prompt = `
     hello
    `;

    // Step 4: Send the prompt to ChatGPT
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const gptResponse = chatCompletion.choices[0]?.message?.content;

    // Step 5: Return the response
    return NextResponse.json({ message: gptResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
