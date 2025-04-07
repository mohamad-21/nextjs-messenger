"use client";

import { sendMessage } from "@/lib/actions/chat.actions";
import { BlockList, User } from "@prisma/client";
import { Paperclip, SendHorizonal } from "lucide-react";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import { useSocket } from "../SocketProvider";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  user: User;
  chatUser: User;
  blockList: BlockList[]
}



function SendMessage({ user, chatUser, blockList }: Props) {
  const [text, setText] = useState("");
  const socket = useSocket();
  const [isPending, startTransition] = useTransition();
  const [image, setImage] = useState<{
    blob?: string,
    file?: File,
    url?: string
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const userIsBlocked = blockList.find(list => list.blocked_id === user.id);

  async function send() {
    setText("");
    let imageUrl: string | null = null;
    startTransition(async () => {
      if (image.file) {
        try {
          await uploadFiles("imageUploader", {
            files: [image.file],
          })
            .then((res) => {
              const url = res[0].ufsUrl;
              setImage({ url });
              imageUrl = url;
            })
        } catch (err: any) {
          setImage({})
          toast({
            title: err.message,
            variant: "destructive"
          });

        }
      }
      await sendMessage({ from: user.id, to: chatUser.id, message: text, imageUrl: imageUrl });
      socket?.send(JSON.stringify({
        type: "send_message",
        from: user.id,
        to: chatUser.id,
        message: text
      }));
    })

  }

  function onPickImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage({ blob: URL.createObjectURL(file), file });

  }

  function handleTextareaHeight() {
    if (textareaRef.current) {
      if (textareaRef.current.value.length > 0) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      } else {
        textareaRef.current.style.height = `60px`;
      }
    }
  }

  if (userIsBlocked) {
    return (
      <div className="relative overflow-hidden flex items-center text-destructive p-3 justify-center">
        <h2>You have been blocked</h2>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden flex items-center bg-zinc-900 px-4">
      <img src={user.profile_photo!} alt={user.name} className={`w-9 h-9 rounded-full object-cover ${text ? "mt-auto mb-3" : ""}`} />
      <textarea ref={textareaRef} className="h-[60px] max-h-[300px] px-4 bg-transparent resize-none pt-5 pb-4 w-full" id="textarea" placeholder="Send a message..." autoFocus onInput={handleTextareaHeight} value={text} onChange={e => setText(e.target.value)} />
      <div className={`flex items-center gap-4 ${text ? "mt-auto mb-4" : ""}`}>
        <button className="right-16" onClick={() => fileInputRef?.current?.click()}>
          <Paperclip className="text-zinc-500" />
        </button>
        <button disabled={!text.trim()} className="right-5 disabled:opacity-50" onClick={send}>
          <SendHorizonal className="text-primary" />
        </button>
      </div>
      <input type="file" hidden className="hidden" ref={fileInputRef} accept="image/*" onChange={onPickImage} />
      {image?.blob && (
        <Dialog open onOpenChange={(open) => {
          if (!open) {
            setImage({});
          }
        }}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <div className="p-5">
                <img src={image?.blob} alt="image" className="w-full" />
              </div>
            </DialogHeader>
            <DialogFooter>
              <div className="flex flex-col gap-2 w-full">
                <Textarea placeholder="Caption..." onChange={(e) => setText(e.target.value)} value={text} />
                <div className="flex items-center gap-2">
                  <DialogClose disabled={isPending}>
                    <Button variant="secondary" disabled={isPending}>Cancel</Button>
                  </DialogClose>
                  <Button onClick={send} disabled={isPending}>Send</Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default SendMessage;
