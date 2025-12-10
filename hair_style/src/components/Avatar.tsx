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
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </UiAvatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40">
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
