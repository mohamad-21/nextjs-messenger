import ChatListWrapper from "@/components/chat/ChatListWrapper";
import ChatPlace from "@/components/chat/ChatPlace";
import EditProfileWrapper from "@/components/settings/EditProfileWrapper";
import SettingsWrapper from "@/components/settings/SettingsWrapper";
import TopHeaderWrapper from "@/components/ui/TopHeaderWrapper";
import { headers } from "next/headers";

type Props = {
  searchParams: { [query: string]: string | undefined }
}

function Home({ searchParams }: Props) {
  const { navigate } = searchParams;
  const pathname = headers().get("x-pathname");

  return (
    <div className="flex flex-1">
      {navigate === "settings" && (
        <SettingsWrapper />
      )}
      {navigate === "edit-profile" && (
        <EditProfileWrapper />
      )}
      <div className={`flex-1 ${pathname !== "/" ? "md:block hidden" : ""} max-h-screen overflow-hidden`}>
        <TopHeaderWrapper />
        <ChatListWrapper />
      </div>
      <ChatPlace />
    </div>
  )
}

export default Home;
