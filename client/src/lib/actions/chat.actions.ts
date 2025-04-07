"use server";

import { PrivateMessage, User } from "@prisma/client";
import prisma from "../prisma";
import { SendMessageProps } from "../types/chat.type";

export async function sendMessage({ from, to, message, imageUrl }: SendMessageProps) {
  const chatData = await prisma.privateChat.findFirst({
    where: {
      OR: [
        {
          user_id: from,
          chat_id: to
        },
        {
          user_id: to,
          chat_id: from
        }
      ]
    }
  });

  if (!chatData) return;

  const data = await prisma.privateMessage.create({
    data: {
      chat_id: chatData.id,
      from,
      to,
      message,
      image: imageUrl
    }
  })

  await prisma.privateChat.update({
    data: {
      last_message: data.message,
      last_message_date: data.createdAt,
      last_message_image: imageUrl
    },
    where: {
      id: chatData.id
    }
  })

  return data;
}

export async function getChatMessages({ user, chatUser }: { user: User, chatUser: User }) {
  const messages = await prisma.privateMessage.findMany({
    where: {
      OR: [
        {
          from: user.id,
          to: chatUser.id
        },
        {
          from: chatUser.id,
          to: user.id
        }
      ]
    }
  });

  return messages;
}

export async function viewChatMessage({ message }: { message: PrivateMessage }) {
  await prisma.privateMessage.update({
    data: {
      unread: 0
    },
    where: {
      id: message.id
    }
  })
}

export async function deleteMessage({ from, to, id }: { from: number, to: number, id: number }) {
  const [lastMessage] = await prisma.privateMessage.findMany({
    where: {
      OR: [
        {
          from: from,
          to: to
        },
        {
          from: to,
          to: from
        }
      ]
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    skip: 1
  });
  if (!lastMessage) return;
  await prisma.privateChat.update({
    data: {
      last_message: lastMessage.message,
      last_message_date: lastMessage.createdAt,
      last_message_image: lastMessage.image
    },
    where: {
      id: lastMessage.chat_id
    }
  })
  await prisma.privateMessage.delete({
    where: {
      id: id
    },
  });
}

export async function editMessage({ id, newMessage }: { id: number, newMessage: string }) {
  const message = await prisma.privateMessage.update({
    data: {
      message: newMessage,
      isEdited: 1,
    },
    where: {
      id
    }
  });
  await prisma.privateChat.update({
    data: {
      last_message: message.message,
      last_message_date: message.createdAt,
      last_message_image: message.image
    },
    where: {
      id: message.chat_id
    }
  })
}

export async function getUserProfileDetails(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  return user;
}