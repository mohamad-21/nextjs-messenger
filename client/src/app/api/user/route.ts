import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;


  const email = params.get("email") || "";
  const bySession = params.get("bySession") || "";
  if (bySession === "true") {
    const session = await auth();
    if (!session?.user) return NextResponse.json({});

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!
      }
    })
    return NextResponse.json(user);
  }
  if (!email) return NextResponse.json({});

  if (params.has("changeConnection")) {
    const status = params.get("changeConnection") as "offline" | "online";
    await prisma.user.update({
      data: {
        status
      },
      where: {
        email
      }
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  return NextResponse.json(user);
}