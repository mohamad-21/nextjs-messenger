"use client";

import { ChannelMember, User, type Channel as ChannelType } from "@prisma/client";
import ChatHeader from "./ChatHeader";
import PostsWrapper from "./PostsWrapper";
import ChannelTypeArea from "./ChannelTypeArea";
import { Button } from "../ui/button";
import ChannelHeader from "./ChannelHeader";

type Props = {
  channel: ChannelType & { members: ChannelMember[] };
  user: User;
}

function Channel({ channel, user }: Props) {

  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-hidden max-h-[100dvh]">
      <ChannelHeader chat={channel} />
      <PostsWrapper />
      {channel.owner_id === user.id ? (
        <ChannelTypeArea user={user} />
      ) : (
        <div>
          {channel.members.some(member => member.member_id === user.id) && (
            <Button variant="secondary" className="w-full rounded-none py-8 text-base uppercase">Join Channel</Button>
          )}
        </div>
      )}
    </div>
  )
}

export default Channel;
