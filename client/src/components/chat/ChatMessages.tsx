"use client";

import { PrivateMessage, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../SocketProvider";
import Message from "./Message";

type Props = {
  user: User;
  chatUser: User;
}

function ChatMessages({ user, chatUser }: Props) {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [isPending, setIsPending] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  async function updateMessages() {
    const res = await fetch(`http://localhost:3000/api/chat/private/messages?between=${user.id}&between=${chatUser.id}`);
    const data = await res.json();
    setMessages(data.map((item: PrivateMessage) => {
      item.createdAt = new Date(item.createdAt);
      item.updatedAt = new Date(item.updatedAt);
      return item;
    }));
  }

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (data) => {
      data = JSON.parse(data.data);
      if (data.type === "trigger_messages") {
        console.log("messages updated");
        updateMessages();
      }
    }
    (async function () {
      setIsPending(true);
      await updateMessages();
      setIsPending(false);
    })()
  }, [socket]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (isPending) {
    return <div className="flex items-center justify-center">Loading messages...</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-3 py-3 px-4 overflow-auto" ref={containerRef}>
      {messages.length > 0 ? (
        <>
          {messages.map(message => (
            <Message key={message.id} message={message} sessionUser={user} />
          ))}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <h2 className="text-zinc-500">No messages here yet.</h2>
        </div>
      )}
    </div>
  )
}

export default ChatMessages;
