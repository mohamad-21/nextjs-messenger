"use client";

import { User } from "@prisma/client";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { io } from "socket.io-client";
import { useSocket } from "../SocketProvider";

type Props = {
  user: User;
}

function ChannelTypeArea({ user }: Props) {
  const [text, setText] = useState("");
  const socket = useSocket();

  async function send() {
    setText("");
    // socket.send({
    //   type: "updated_channel_posts",
    //   // from: user.id,
    //   // to: chatUser.id,
    //   // message: text
    // });
  }

  return (
    <div className="relative overflow-hidden">
      {/* <ScrollArea */}
      <Textarea className="border-t border-t-muted !border-x-0 min-h-0 h-12 pt-3 !border-b-0 outline-none pr-12 rounded-none" placeholder="Post a message..." value={text} onChange={e => setText(e.target.value)} />
      <button disabled={!text.trim()} className="absolute top-1/2 -translate-y-1/2 right-5 disabled:opacity-50" onClick={send}>
        <SendHorizonal className="text-primary" />
      </button>
    </div>
  )
}

export default ChannelTypeArea;
