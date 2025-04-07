import { signOut } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await signOut({
    redirectTo: "/login"
  });
}