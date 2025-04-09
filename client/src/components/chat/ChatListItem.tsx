import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ChatListType } from "@/lib/types/chat.type";

type Props = {
  chat: ChatListType
}

function ChatListItem({ chat }: Props) {
  return (
    <Link href={chat.link} className="flex">
      <Button
        variant="ghost"
        className="flex gap-4 py-10 px-5 flex-1"
        size="lg"
      >
        <div className="flex items-center gap-3 w-full">
          <div className="flex-shrink-0">
            {chat.profile_photo ? (
              <img src={chat.profile_photo} alt={chat.name} className="rounded-full w-[54px] h-[54px] border border-muted aspect-square object-cover" />
            ) : (
              <div className="w-[54px] h-[54px] rounded-full border border-muted flex items-center justify-center text-lg uppercase bg-muted">{chat.name[0]}</div>
            )}
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-lg text-muted-foreground">{chat.name}</span>
              {chat.last_message_date && (
                <span className="text-muted-foreground text-sm font-light">
                  {Intl.DateTimeFormat("en-us", {
                    timeStyle: "short"
                  }).format(new Date(chat.last_message_date))}
                </span>
              )}
            </div>
            <div className="inline-flex items-center gap-1">
              {chat.last_message_image && (
                <img src={chat.last_message_image} width={20} height={20} alt={chat.last_message || "image"} className="mr-2" />
              )}
              {chat.last_message && (
                <span className="text-sm font-light text-muted-foreground truncate max-w-xs text-left">
                  {chat.last_message}
                </span>
              )}
            </div>
          </div>
        </div>

      </Button>
    </Link>
  )
}

export default ChatListItem;
