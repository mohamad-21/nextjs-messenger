import { Menu } from "lucide-react";
import React from "react";
import TopHeader from "./TopHeader";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function TopHeaderWrapper() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user!.email!
    }
  });

  return (
    <TopHeader user={user!} />
  )
}

export default TopHeaderWrapper;
