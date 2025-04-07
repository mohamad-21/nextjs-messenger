import { getUserChatlist } from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";
import ChatList from "./ChatList";

async function ChatListWrapper() {
  const session = await auth();
  const chatlist = await getUserChatlist({ fetchMode: "session" });

  return (
    <div className="flex-1">
      <ChatList chatlist={chatlist} user={session?.user!} />
    </div>
  )
}

export default ChatListWrapper;
