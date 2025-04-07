"use client";

import { getData } from "@/hooks/useFetch";
import { ChatListType } from "@/lib/types/chat.type";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { useSocket } from "../SocketProvider";
import ChatItem from "./ChatListItem";

type Props = {
  chatlist: ChatListType[]
  user: User
}

function ChatList({ chatlist: initialList, user }: Props) {
  const [chatlist, setChatlist] = useState(initialList);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.addEventListener("message", (data) => {
      data = JSON.parse(data.data);
      if (data.type === "trigger_messages") {
        getData(`/api/user/chatlist?email=${user.email}`)
          .then(data => {
            if (data) {
              setChatlist(data);
            }
          })
      }
    })
  }, [socket]);

  if (!chatlist?.length) return null;

  return (
    <div className="flex flex-col">
      {chatlist.map(chat => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  )
}

export default ChatList;
