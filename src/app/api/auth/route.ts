import { NextResponse } from "next/server";
import admin from "../../../../firebase/fireBaseAdmin";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to extract error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export async function POST(req: Request) {
  try {
    console.log("Starting /api/auth POST request...");

    // Validate Content-Type header
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid Content-Type header:", contentType);
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected application/json." },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("Parsed request body:", body);
    } catch (parseError) {
      console.error(
        "Failed to parse request body:",
        getErrorMessage(parseError)
      );
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { token, name, phone, image } = body;

    // Validate required fields
    if (!token || !name || !image) {
      console.error("Missing required fields in request body:", {
        token,
        name,
        image,
      });
      return NextResponse.json(
        { error: "Missing required fields: token, name, phone, or image" },
        { status: 400 }
      );
    }

    console.log("Verifying Firebase token...");
    // Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log("Decoded Firebase token:", decodedToken);
    } catch (firebaseError) {
      console.error("Firebase auth error:", getErrorMessage(firebaseError));
      if (
        firebaseError instanceof Error &&
        firebaseError.message.includes("id-token-expired")
      ) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { uid, email } = decodedToken;
    console.log("Extracted UID and email from decoded token:", { uid, email });

    // Upsert user in the database
    console.log("Upserting user in the database...");
    let user;
    try {
      user = await prisma.user.upsert({
        where: { id: uid },
        update: { name },
        create: {
          id: uid,
          email: email ?? "unknown@example.com",
          name,
        },
      });
      console.log("User upserted successfully:", user);
    } catch (prismaError) {
      console.error(
        "Prisma error during upsert:",
        getErrorMessage(prismaError)
      );
      return NextResponse.json(
        { error: "Database error", details: getErrorMessage(prismaError) },
        { status: 500 }
      );
    }

    console.log("Returning successful response...");
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", getErrorMessage(error));
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
