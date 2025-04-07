"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { ImagePlus, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ShowPictureDialog from "../ShowPictureDialog";
import DefaultProfilePhoto from "../ui/DefaultProfilePhoto";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { uploadFiles } from "@/lib/uploadthing";
import { updateUserDetails } from "@/lib/actions/user.actions";
import { toast } from "@/hooks/use-toast";

type Props = {
  user: User
}

const formSchema = z
  .object({
    name: z
      .string({ message: "name is required" })
      .min(3, { message: "name must contains at least 3 characters" }),
    bio: z
      .string().optional(),
    username: z
      .string({ message: "username is required" })
      .min(5, { message: "username must contains at least 5 characters" }),
  })

function EditProfileModal({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState<{
    blob?: string,
    file?: File,
    url?: string
  }>({});
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio || ""
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();


  function goBack() {
    const params = new URLSearchParams(searchParams);
    params.delete("navigate")
    router.replace(pathname);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      let imageUrl;
      const { name, username, bio } = values;
      if (image.file) {
        await uploadFiles(" imageUploader", {
          files: [image.file],
          onUploadProgress: (opts) => {
            toast({
              title: "Uploading Profile...",
              description: `${Math.floor(opts.progress)}%`
            })
          }
        })
          .then(res => {
            const url = res[0].ufsUrl;
            imageUrl = url;
          })
          .catch(err => {
            toast({
              title: "Profile was not updated, unknown error occurred",
              variant: "destructive"
            });
          })
      }

      try {
        await updateUserDetails({ id: user.id, name, bio, username, profile_photo: imageUrl || user.profile_photo! });
        toast({
          title: "Profile successfully updated",
        });
        const params = new URLSearchParams(searchParams);
        params.set("navigate", "settings")
        router.replace(pathname);
      } catch (err) {
        toast({
          title: "Profile was not updated, unknown error occurred",
          variant: "destructive"
        });
      }
    })
  }

  function onPickImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage({ blob: URL.createObjectURL(file), file });
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
            <h2 className="text-xl">Edit Profile</h2>
            <div className="flex items-center gap-3">
              <button onClick={goBack}>
                <X size={25} />
              </button>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="mx-auto relative">
                {user.profile_photo ? (
                  <img src={image.blob || user.profile_photo} alt={user.name} className="w-[100px] h-[100px] rounded-full object-cover" />
                ) : <DefaultProfilePhoto w="100px" name={user.name} />}
                <button className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-full" onClick={() => fileInputRef?.current?.click()} disabled={isPending}>
                  <ImagePlus size={30} className="text-zinc-300" />
                </button>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  disabled={isPending}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <Input defaultValue={user.name} {...field} />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <Input defaultValue={user.bio || ""} {...field} />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>@Username</FormLabel>
                      <Input defaultValue={user.username} {...field} />
                    </FormItem>
                  )}
                />
                <Button className="!font-bold text-base w-full" disabled={isPending}>
                  Save
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {showImage && <ShowPictureDialog open={showImage} image={user.profile_photo!} onClose={() => setShowImage(false)} />}
      <input type="file" hidden className="hidden" ref={fileInputRef} accept="image/*" onChange={onPickImage} />
    </>
  )
}

export default EditProfileModal;
