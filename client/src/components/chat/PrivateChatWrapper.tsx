"use client";

import { BlockList, User } from "@prisma/client";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import SendMessage from "./SendMessage";

type Props = {
  user: User;
  chatUser: User;
  blockList: BlockList[]
}

function PrivateChatWrapper({ user, chatUser, blockList }: Props) {
  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-hidden max-h-[100dvh]">
      <ChatHeader user={user} chat={chatUser} blockList={blockList} />
      <ChatMessages user={user} chatUser={chatUser} />
      <SendMessage user={user} chatUser={chatUser} blockList={blockList} />
    </div>
  )
}

export default PrivateChatWrapper;
