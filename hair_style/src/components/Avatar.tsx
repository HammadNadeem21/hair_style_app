"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar as UiAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

interface AvatarMenuProps {
  image?: string;
  name?: string;
  onLogout?: () => void;
}

export function Avatar({
  image,
  name = "User",
  onLogout = () => alert("Logout clicked!"),
}: AvatarMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UiAvatar className="cursor-pointer">
          <AvatarImage src={image} alt={name} referrerPolicy="no-referrer" />
          <AvatarFallback className="text-primaryColor bg-primaryColor/30">{name.charAt(0)}</AvatarFallback>
        </UiAvatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40 bg-primaryColor">
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-white focus:bg-primaryColor focus:text-white">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
