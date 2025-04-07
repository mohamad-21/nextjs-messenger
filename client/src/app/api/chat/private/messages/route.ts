import { getChatMessages } from "@/lib/actions/chat.actions";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  if (!searchParams.has("between") && searchParams.getAll("between").length !== 2) {
    return NextResponse.json({ message: "query params not correct" });
  }
  const [first, second] = searchParams.getAll("between");
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [parseInt(first), parseInt(second)]
      }
    }
  })
  if (!users) {
    return NextResponse.json({ message: "chat not found" });
  }

  const messages = await getChatMessages({ user: users[0], chatUser: users[1] });

  return NextResponse.json(messages);
}