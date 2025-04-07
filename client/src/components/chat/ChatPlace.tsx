import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";
import Channel from "./Channel";
import Private from "./Private";
import { auth } from "@/lib/auth";

async function ChatPlace() {
  const session = await auth();
  if (!session?.user) return;
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email!
    }
  })
  let pathname = headers().get("x-pathname");

  if (pathname === "/" || !pathname) {
    return (
      <Layout>
        <h3 className="text-muted-foreground">Select a chat to start messaging</h3>
      </Layout>
    )
  }

  pathname = pathname.replace("/", "");

  const userChat = await prisma.user.findUnique({
    where: {
      username: pathname
    }
  })
  const userBlockList = await prisma.blockList.findMany({
    where: {
      OR: [
        { user_id: user!.id },
        { blocked_id: user!.id },
      ]
    }
  })

  if (userChat) {
    return (
      <Layout>
        <Private user={user!} chatUser={userChat} blockList={userBlockList} />
      </Layout>
    )
  }

  const channel = await prisma.channel.findFirst({
    where: {
      link: pathname
    },
    include: {
      members: true
    }
  });

  if (!channel) {
    return (
      <Layout>
        <h3 className="text-muted-foreground">Chat not found</h3>
      </Layout>
    )
  }

  return (
    <Layout>
      <Channel channel={channel} user={user!} />
    </Layout>
  )

}

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-pathname");

  return (
    <div className={`flex-1 items-center justify-center md:border-l-2 border-l-card ${pathname === "/" ? "md:flex hidden" : "flex"}`}>
      {children}
    </div>
  )
}

export default ChatPlace;
