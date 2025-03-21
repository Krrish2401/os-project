// app/api/file/upload/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
      const directoryId = formData.get("directoryId") as string;
      const userId = formData.get("userId") as string;

    if (!file || !directoryId) {
      return NextResponse.json(
        { error: "File and directory ID are required" },
        { status: 400 }
      );
    }

    // Simulate storing the file (e.g., in cloud storage like AWS S3)
    const fileUrl = `https://example.com/files/${file.name}`; // Replace with actual storage logic

    // Save file metadata in the database
    const newFile = await prisma.file.create({
      data: {
        name: file.name.split(".").slice(0, -1).join("."),
        extension: file.name.split(".").pop() || "",
        fileUrl: fileUrl,
        dirId: directoryId,
        userId: userId, // Replace with actual user ID logic
      },
    });

    return NextResponse.json({ success: true, file: newFile });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
