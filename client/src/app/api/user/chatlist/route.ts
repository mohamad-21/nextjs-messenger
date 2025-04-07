import { getUserChatlist } from "@/lib/actions/user.actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || "";

  const userChatList = await getUserChatlist({ fetchMode: "email", email })

  if (!userChatList?.length) {
    return NextResponse.json({});
  }

  return NextResponse.json(userChatList);
}