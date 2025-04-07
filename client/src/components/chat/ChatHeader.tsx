"use client";

import { toast } from "@/hooks/use-toast";
import { getData } from "@/hooks/useFetch";
import { blockUser, unblockUser } from "@/lib/actions/user.actions";
import { BlockList, User } from "@prisma/client";
import { AlertCircle, ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmAlert from "../ConfirmAlert";
import ShowPictureDialog from "../ShowPictureDialog";
import { useSocket } from "../SocketProvider";
import { Button } from "../ui/button";
import DefaultProfilePhoto from "../ui/DefaultProfilePhoto";
import { Dialog, DialogClose, DialogContent, DialogHeader } from "../ui/dialog";

type Props = {
  user: User;
  chat: User;
  blockList: BlockList[]
}

function ChatHeader({ user, chat, blockList }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(chat.status);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showBlockAlert, setShowBlockAlert] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [receiverIsBlocked, setReceiverIsBlocked] = useState(blockList.some(list => list.blocked_id === chat.id));
  const socket = useSocket();
  const userIsBlocked = blockList.find(list => list.blocked_id === user.id);

  async function handleUserBlock() {
    if (!receiverIsBlocked) {
      setShowBlockAlert(true);
    } else {
      await unblockUser({ userId: user.id, blockedId: chat.id });
      if (receiverIsBlocked) {
        setReceiverIsBlocked(false);
        toast({
          title: `${chat.name} has been unblocked`
        });
      }
    }
  }

  useEffect(() => {
    if (!socket) return;
    socket.addEventListener("message", event => {
      const data = JSON.parse(event.data);

      if (data.type === "connection" && data.id === chat.id) {
        getData(`/api/user?email=${chat.email}&changeConnection=${data.connected ? "online" : "offline"}`).then((data: User) => {
          if (data) {
            toast({
              title: `${data.name} has been ${data.status === "offline" ? "disconnected" : "connected"}`
            });
            setStatus(data.status);
          }
        });
      }
    });
  }, [socket]);

  return (
    <>
      <Dialog open={showProfileDetails} onOpenChange={(open) => {
        if (!open) setShowProfileDetails(false);
      }}>
        <Button variant="secondary" className="w-full flex items-center text-left justify-between gap-3 py-3 px-5 h-auto" onClick={() => setShowProfileDetails(true)}>
          <div className="flex items-center gap-2">
            <div className="md:hidden" onClick={() => router.back()}><ChevronLeft size={20} className="!size-6" /></div>
            <div>
              {chat.profile_photo ? (
                <img src={chat.profile_photo} alt={chat.name} className="w-[45px] h-[45px] rounded-full object-cover" />
              ) : <DefaultProfilePhoto name={chat.name} />}
            </div>
            <div>
              <h3 className="text-lg leading-6">{chat.name}</h3>
              {userIsBlocked ? (
                <span className="text-xs text-muted-foreground">last seen a long time ago</span>
              ) : (
                <>
                  {status === "online" ? (
                    <span className="text-xs text-primary">Online</span>
                  ) : (
                    <p className="text-sm text-muted-foreground">last seen recently</p>
                  )}
                </>
              )}
            </div>
          </div>
        </Button>
        <DialogContent className="[&>button:last-child]:hidden">
          <DialogHeader className="flex items-center flex-row justify-between">
            <h2 className="text-xl">User Info</h2>
            <DialogClose>
              <button>
                <X size={25} />
              </button>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 mb-5">
              <button onClick={() => setShowImage(true)}>
                {chat.profile_photo ? (
                  <img src={chat.profile_photo} alt={chat.name} className="w-[100px] h-[100px] rounded-full object-cover" />
                ) : <DefaultProfilePhoto w="100px" name={chat.name} />}
              </button>
              <div>
                <h2 className="text-xl mb-0.5">{chat.name}</h2>
                {userIsBlocked ? (
                  <span className="text-sm text-muted-foreground">last seen a long time ago</span>
                ) : (
                  <>
                    {status === "online" ? (
                      <span className="text-xs text-primary">Online</span>
                    ) : (
                      <p className="text-sm text-muted-foreground">last seen recently</p>
                    )}
                  </>
                )}
              </div>
            </div>
            {chat.bio && (
              <div className="flex flex-col gap-1">
                <span>{chat.bio}</span>
                <span className="text-muted-foreground text-sm">Bio</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Link href={`/${chat.username}`} className="text-primary">@{chat.username}</Link>
              <span className="text-muted-foreground text-sm">Username</span>
            </div>
            <Button variant="secondary" className="text-left h-[60px] justify-start text-base" onClick={() => setShowProfileDetails(false)}>Send Message</Button>
            <button className="flex items-center gap-1 text-destructive mt-6" onClick={handleUserBlock}>
              <AlertCircle size={20} />
              <span>{receiverIsBlocked ? "Unblock" : "Block"} {chat.name}</span>
            </button>
          </div>
        </DialogContent>
        {showBlockAlert && (
          <ConfirmAlert
            title={`Block ${chat.name}`}
            desc={`Do you want to block ${chat.name} from messaging you?`}
            onClose={() => setShowBlockAlert(false)}
            onAction={async () => {
              await blockUser({ userId: user.id, blockedId: chat.id });
              toast({
                title: `${chat.name} has been blocked`
              });
              setReceiverIsBlocked(true);
              setShowBlockAlert(false);
            }}
            actionTitle="Block"
          />
        )}
      </Dialog>
      {showImage && <ShowPictureDialog open={showImage} image={chat.profile_photo!} onClose={() => setShowImage(false)} />}
    </>
  )
}

export default ChatHeader;
