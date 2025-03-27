import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { error } from "console";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if(!userId){
      return NextResponse.json(
        {error: "user id is required"},
        {status:400}
      )
    }
    
    const directory = await prisma.directory.findFirst({
      where: {userId},
      orderBy: { accessCount: "desc" },
    });

    return NextResponse.json({ directory });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch directory" },
      { status: 500 }
    );
  }
}