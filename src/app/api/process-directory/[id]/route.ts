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
  const { id: dirId } = await context.params;

  try {
    // Step 1: Fetch the directory and its files
    const directory = await prisma.directory.findUnique({
      where: { id: dirId },
      include: {
        files: true, // Include all files in the directory
        subdirs: true, // Include all subdirectories (child directories)
      },
    });

    if (!directory) {
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 404 }
      );
    }

    // Step 2: Group files by their extensions
    const filesByExtension = directory.files.reduce((acc, file) => {
      const { extension } = file;
      if (!acc[extension]) {
        acc[extension] = [];
      }
      acc[extension].push(file);
      return acc;
    }, {} as Record<string, typeof directory.files>);

    // Step 3: Process each extension group
    for (const [extension, files] of Object.entries(filesByExtension)) {
      // Check if a subdirectory with the file's extension exists
      let subdirectory = directory.subdirs.find(
        (subdir) => subdir.name === extension
      );

      // If the subdirectory doesn't exist, create it
      if (!subdirectory) {
        subdirectory = await prisma.directory.create({
          data: {
            name: extension, // Name the subdirectory after the file extension
            userId: directory.userId, // Assign ownership to the same user
            parentId: directory.id, // Link the subdirectory to the current directory
          },
        });
      }

      // Move all files with this extension into the subdirectory
      await prisma.file.updateMany({
        where: {
          id: { in: files.map((file) => file.id) }, // Update all files in this group
        },
        data: {
          dirId: subdirectory.id, // Assign the files to the subdirectory
        },
      });
    }

    // Step 4: Construct a prompt for ChatGPT
    const prompt = `
     only reply with  "files processed" with a happy message and dont reply anything else
    `;

    // Step 5: Send the prompt to ChatGPT
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const gptResponse = chatCompletion.choices[0]?.message?.content;

    // Step 6: Return the response
    return NextResponse.json({ message: gptResponse });
  } catch (error) {
    console.error("Error processing directory:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}