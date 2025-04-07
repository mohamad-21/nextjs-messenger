"use client";

import { Channel, ChannelMember } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import DefaultProfilePhoto from "../ui/DefaultProfilePhoto";

type Props = {
  chat: Channel & { members: ChannelMember[] }
}

function ChannelHeader({ chat }: Props) {
  const router = useRouter();

  return (
    <Button variant="secondary" className="w-full flex items-center text-left justify-between gap-3 py-3 px-5 h-auto">
      <div className="flex items-center gap-2">
        <div className="md:hidden" onClick={() => router.back()}><ChevronLeft size={20} className="!size-6" /></div>
        <div>
          {chat.profile_photo ? (
            <img src={chat.profile_photo} alt={chat.name} className="w-[45px] h-[45px] rounded-full object-cover" />
          ) : <DefaultProfilePhoto name={chat.name} />}
        </div>
        <div>
          <h3 className="text-lg">{chat.name}</h3>
          <span className="text-xs text-muted-foreground">{chat.members.length} Subscribers</span>
        </div>
      </div>
    </Button>
  )
}

export default ChannelHeader;
