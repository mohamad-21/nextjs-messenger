import { BlockList, User } from "@prisma/client";
import PrivateChatWrapper from "./PrivateChatWrapper";

type Props = {
  user: User;
  chatUser: User;
  blockList: BlockList[]
}

function Private({ user, chatUser, blockList }: Props) {
  return (
    <PrivateChatWrapper user={user} chatUser={chatUser} blockList={blockList} />
  )
}

export default Private;
