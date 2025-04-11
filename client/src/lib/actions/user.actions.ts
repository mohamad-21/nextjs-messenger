"use server";

import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "../auth";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import { CreateUser } from "@/components/auth/CreateAccountForm";
import { redirect } from "next/navigation";
import { ChatListType } from "../types/chat.type";
import { PrivateChat } from "@prisma/client";

export async function loginWithGoogle() {
  await signIn("google", {
    redirectTo: "/",
  });
}

export async function credentialsLogin({ email, password }: { email: string, password: string }) {

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: email as string,
        },
        {
          username: email as string,
        }
      ]
    }
  })

  if (!user) {
    throw new Error("user not found");
  }

  const isSamePassword = await bcrypt.compare(password, user.password || "");
  if (!isSamePassword) {
    throw new Error("user not found");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false
    });
  } catch (err) {
    if (err instanceof AuthError) {
      throw new Error((err as AuthError).cause?.err?.message || "an unknown error occurred");
    }
  }
}

export async function createAccount(data: Omit<CreateUser, "confirm">) {
  const { name, username, email, password } = data;
  if (!name.trim() || !username.trim() || !password.trim()) {
    throw new Error("all fields is required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
      account_type: "credential"
    }
  });
  const users = await prisma.user.findMany();
  const newChats = users.map(user => {
    return {
      user_id: userData.id,
      chat_id: user.id,
      last_message: null,
      last_message_date: null,
    }
  });
  await prisma.privateChat.createMany({
    data: newChats
  })

  redirect("/login");
}

export async function getUserChatListOld() {
  const session = await auth();
  const users = await prisma.user.findMany({
    where: {
      email: {
        not: session?.user?.email!
      }
    }
  })
  const channels = await prisma.channel.findMany();

  const chatlist = [...users.map(user => {
    return {
      name: user.name,
      profile_photo: user.profile_photo,
      link: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }), ...channels.map(channel => {
    return {
      name: channel.name,
      profile_photo: channel.profile_photo,
      link: channel.link,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt
    }
  })].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map((chat, idx) => {
    return {
      id: idx + 1,
      ...chat
    }
  });

  return chatlist;
}

export async function getUserChatlist({ fetchMode = "session", email }: { fetchMode?: "session" | "email", email?: string }) {
  let user = null;
  if (fetchMode === "session") {
    const session = await auth();
    if (!session?.user) return [];
    user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email!
      }
    });
  } else if (fetchMode === "email" && email) {
    user = await prisma.user.findUnique({
      where: {
        email
      }
    });
  }
  if (!user) return [];

  const privateChats = await prisma.privateChat.findMany({
    where: {
      OR: [
        {
          user_id: user.id,
        },
        {
          chat_id: user.id
        }
      ]
    },
    include: {
      users_chat_id: true,
      users_user_id: true
    }
  });

  if (!privateChats.length) return [];

  // const channelsJoined = await prisma.channelMember.findMany({
  //   where: {
  //     member_id: user.id
  //   }
  // })
  // const channelIds = channelsJoined.map(c => c.channel_id);

  // const channels = await prisma.channel.findMany({
  //   where: {
  //     id: {
  //       in: channelIds
  //     }
  //   }
  // })

  const privateChatLists = privateChats.map(c => {
    const chatuserData = user.id === c.chat_id ? c.users_user_id : c.users_chat_id;
    return {
      id: Math.random() * c.id,
      name: chatuserData.name,
      profile_photo: chatuserData.profile_photo,
      link: chatuserData.username,
      last_message: c.last_message,
      last_message_date: c.last_message_date,
      last_message_image: c.last_message_image,
      createdAt: chatuserData.createdAt,
      updatedAt: chatuserData.updatedAt
    }
  });

  if (!privateChatLists.length) return [];

  // const channelsList = channels.map(c => {
  //   return {
  //     id: Math.random() * c.id,
  //     name: c.name,
  //     profile_photo: c.profile_photo,
  //     link: c.link,
  //     last_message: c.last_message,
  //     last_message_date: c.last_message_date,
  //     createdAt: c.createdAt,
  //     updatedAt: c.updatedAt
  //   }
  // });

  // return [...privateChatLists, ...channelsList].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return [...privateChatLists].sort((a, b) => (b.last_message_date?.getTime() ?? b.updatedAt.getTime()) - (a.last_message_date?.getTime() ?? a.updatedAt.getTime()));

}

export async function updateConnection({ status }: { status: "offline" | "online" }) {
  const session = await auth();
  const data = await prisma.user.update({
    data: {
      status
    },
    where: {
      email: session?.user?.email!
    }
  });
}

export async function getUserId() {
  const session = await auth();
  return session?.user?.id;
}

export async function logout() {
  await signOut({
    redirectTo: "/login"
  });
}

export async function blockUser({ userId, blockedId }: { userId: number, blockedId: number }) {
  const session = await auth();
  if (!session?.user?.email) return;
  const userBlockList = await prisma.blockList.findMany({
    where: {
      user_id: userId
    }
  });

  if (!userBlockList.length) {
    await prisma.blockList.create({
      data: {
        user_id: userId,
        blocked_id: blockedId
      }
    })
  } else if (userBlockList.some(list => list.blocked_id === blockedId)) {
    return;
  }
}

export async function unblockUser({ userId, blockedId }: { userId: number, blockedId: number }) {
  const blockedRecord = await prisma.blockList.findFirst({
    where: {
      user_id: userId,
      blocked_id: blockedId
    }
  });

  if (blockedRecord) {
    await prisma.blockList.delete({
      where: {
        id: blockedRecord.id
      }
    });
  }
}

export async function updateUserDetails({ id, name, bio, username, profile_photo }: { id: number, name: string, username: string, bio?: string, profile_photo?: string }) {
  if (!name || !username) return;

  await prisma.user.update({
    where: {
      id
    },
    data: {
      name,
      username,
      bio,
      profile_photo
    }
  })
}