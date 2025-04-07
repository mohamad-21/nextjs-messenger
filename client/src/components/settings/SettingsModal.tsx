"use client";

import { User } from "@prisma/client";
import { Pencil, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ShowPictureDialog from "../ShowPictureDialog";
import DefaultProfilePhoto from "../ui/DefaultProfilePhoto";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

type Props = {
  user: User
}

function SettingsModal({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showImage, setShowImage] = useState(false);

  function goBack() {
    const params = new URLSearchParams(searchParams);
    params.delete("navigate")
    router.replace(pathname);
  }

  return (
    <>
      <Dialog open onOpenChange={(open) => {
        if (!open) {
          goBack();
        }
      }}>
        <DialogContent className="[&>button:last-child]:hidden">
          <DialogHeader className="flex items-center flex-row justify-between">
            <h2 className="text-xl">Info</h2>
            <div className="flex items-center gap-3">
              <button onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("navigate", "edit-profile")
                router.replace(`${pathname}?${params.toString()}`);
              }}>
                <Pencil size={20} />
              </button>
              <button onClick={goBack}>
                <X size={25} />
              </button>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 mb-5">
              <button onClick={() => setShowImage(true)}>
                {user.profile_photo ? (
                  <img src={user.profile_photo} alt={user.name} className="w-[100px] h-[100px] rounded-full object-cover" />
                ) : <DefaultProfilePhoto w="100px" name={user.name} />}
              </button>
              <div>
                <h2 className="text-xl mb-1">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {user.bio && (
              <div className="flex flex-col gap-1">
                <span>{user.bio}</span>
                <span className="text-muted-foreground text-sm">Bio</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Link href={`/${user.username}`} className="text-primary">@{user.username}</Link>
              <span className="text-muted-foreground text-sm">Username</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showImage && <ShowPictureDialog open={showImage} image={user.profile_photo!} onClose={() => setShowImage(false)} />}
    </>
  )
}

export default SettingsModal;
