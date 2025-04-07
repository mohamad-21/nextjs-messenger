import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import React from "react";
import Message from "./Message";
import ChatMessages from "./ChatMessages";

type Props = {
  user: User;
  chatUser: User
}

async function ChatMessagesWrapper({ user, chatUser }: Props) {
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

  // return (
  //   <ChatMessages user={user} chatUser={chatUser} messages={messages} />
  // )
}

export default ChatMessagesWrapper;
