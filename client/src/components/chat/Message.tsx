"use client";

import { useIsVisible } from "@/hooks/useVisible";
import { deleteMessage, editMessage, viewChatMessage } from "@/lib/actions/chat.actions";
import { PrivateMessage, User } from "@prisma/client";
import { CheckCheck, CheckIcon, Pencil, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useSocket } from "../SocketProvider";
import Loading from "../ui/Loading";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { toast } from "@/hooks/use-toast";
import { getData } from "@/hooks/useFetch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ConfirmAlert from "../ConfirmAlert";
import ShowPictureDialog from "../ShowPictureDialog";

type Props = {
  message: PrivateMessage;
  sessionUser: User
}

function Message({ message, sessionUser }: Props) {
  const messageRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(messageRef);
  const socket = useSocket();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditMessageDialog, setShowEditMessageDialog] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [editMessageText, setEditMessageText] = useState(message.message || "");
  const [isPending, startTransition] = useTransition();
  const [imageLoaded, setImageLoaded] = useState(false);

  async function readMessage() {
    await viewChatMessage({ message });
  }

  async function onDeleteMessage() {
    startTransition(async () => {
      await deleteMessage({ from: message.from, to: message.to, id: message.id });
      socket?.send(JSON.stringify({
        type: "trigger_messages",
        clients: [message.from, message.to]
      }));
      toast({
        title: "Message deleted"
      });
    })
  }

  function handleMessageEdit() {
    startTransition(async () => {
      editMessage({ id: message.id, newMessage: editMessageText })
        .then(() => {
          socket?.send(JSON.stringify({
            type: "trigger_messages",
            clients: [message.from, message.to]
          }));
          toast({
            title: "Message updated"
          });
          setShowEditMessageDialog(false);
        })
    })
  }

  useEffect(() => {
    if (message.unread) {
      if (!isVisible) return;

      const receiverIsCurrentUser = sessionUser.id === message.to;

      if (receiverIsCurrentUser) {

        readMessage()
          .then(() => {
            if (!socket) return;
            socket.send(JSON.stringify({
              type: "trigger_messages",
              clients: [sessionUser.id, message.to, message.from]
            }));
          });
      }
    }
  }, [isVisible, socket]);

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div ref={messageRef}>
            <div className={`${message.from === sessionUser.id ? "bg-primary-foreground rounded-tr-xl" : "bg-zinc-900 rounded-tl-xl"} py-2 px-3 ${message.from === sessionUser.id ? "ml-auto" : "mr-auto"} max-w-max w-[90%]`}>
              {message.image && (
                <div className="w-full h-auto mb-2">
                  <button onClick={() => setShowImage(true)} className="hover:brightness-75 transition-all">
                    <img src={message.image} className={`rounded-t-xl ${imageLoaded ? "block" : "hidden"}`} onLoad={(e) => setImageLoaded(true)} alt={message.message || "image"} />
                  </button>
                  {!imageLoaded && (
                    <div className="flex items-center justify-center h-[200px] w-[200px">
                      <Loading size="lg" />
                    </div>
                  )}
                </div>
              )}
              <p className="whitespace-pre-line inline mr-1.5">{message.message?.trim()}</p>
              <div className="inline-flex items-center gap-1 text-slate-400">
                {message.isEdited === 1 && (
                  <span className="text-sm">edited</span>
                )}
                <span className="text-sm">{Intl.DateTimeFormat("en-us", { timeStyle: "short" }).format(message.createdAt)}</span>
                <span>{message.unread === 1 ? <CheckIcon size={16} /> : <CheckCheck size={16} />}</span>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="space-y-1">
          <ContextMenuItem className="cursor-pointer" onSelect={() => setShowEditMessageDialog(true)}>
            <div className="flex items-center gap-2">
              <Pencil size={20} /> Edit Message
            </div>
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setShowDeleteAlert(true)} className="cursor-pointer text-red-600">
            <div className="flex items-center gap-2">
              <Trash2Icon size={20} /> Delete Message
            </div>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {showImage && <ShowPictureDialog open={showImage} onClose={() => setShowImage(false)} image={message.image!} />}
      {showDeleteAlert && (
        <ConfirmAlert title="Are you sure you want to delete?" desc="This will remove and can't be undone" onClose={() => setShowDeleteAlert(false)} onAction={onDeleteMessage} actionTitle="Delete" />
      )}
      {showEditMessageDialog && (
        <Dialog open onOpenChange={(open) => {
          if (!open) setShowEditMessageDialog(false);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit message</DialogTitle>
            </DialogHeader>
            <div>
              <Input
                value={editMessageText}
                onChange={(e) => setEditMessageText(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button disabled={isPending} onClick={() => setShowEditMessageDialog(false)}>Cancel</Button>
              <Button disabled={isPending} onClick={handleMessageEdit}>Edit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default Message;
