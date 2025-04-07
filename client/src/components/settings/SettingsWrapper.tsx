import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import React from "react";
import SettingsModal from "./SettingsModal";

async function SettingsWrapper() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user!.email!
    }
  });

  if (!user) return;

  return (
    <SettingsModal user={user} />
  )

}

export default SettingsWrapper;
