"use client";

import { logout } from "@/lib/actions/user.actions";
import { User } from "@prisma/client";
import { LogOut, Menu, Settings } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ConfirmAlert from "../ConfirmAlert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import Logo from "./Logo";
import Link from "next/link";

type Props = {
  user: User
}

function TopHeader({ user }: Props) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleSettingsSelect() {
    const params = new URLSearchParams(searchParams);
    params.set("navigate", "settings");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <DropdownMenu>
      <div className="flex items-center gap-6 py-3 px-5 bg-zinc-900">
        <DropdownMenuTrigger>
          <button className="w-full flex items-center justify-center">
            <Menu size={30} />
          </button>
        </DropdownMenuTrigger>
        <Link href="/" className="flex items-center text-xl gap-0.5"><Logo size="40" /> Messenger</Link>

        <DropdownMenuContent sideOffset={22} className="translate-x-8 scale-110">
          <DropdownMenuItem onSelect={handleSettingsSelect}>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowLogoutConfirm(true)}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
        {showLogoutConfirm && (
          <ConfirmAlert title="Are you sure you want to logout?" onAction={async () => await logout()} onClose={() => setShowLogoutConfirm(false)} actionTitle="Logout" />
        )}
      </div>
    </DropdownMenu>
  )
}

export default TopHeader;
