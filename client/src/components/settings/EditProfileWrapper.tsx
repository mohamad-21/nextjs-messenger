import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import EditProfileModal from "./EditProfileModal";

async function EditProfileWrapper() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user!.email!
    }
  });

  if (!user) return;

  return (
    <EditProfileModal user={user} />
  )

}

export default EditProfileWrapper;
