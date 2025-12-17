import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,

} from "@/components/ui/dropdown-menu";
import { Avatar as UiAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Coins } from "lucide-react";

interface AvatarMenuProps {
  image?: string;
  name?: string;
  email?: string;
  credits?: number;
  onLogout?: () => void;
}

export function Avatar({
  image,
  name = "User",
  email = "",
  credits = 0,
  onLogout = () => alert("Logout clicked!"),
}: AvatarMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <UiAvatar className="cursor-pointer border-2 border-transparent hover:border-primaryColor/20 transition-all">
          <AvatarImage src={image} alt={name} referrerPolicy="no-referrer" />
          <AvatarFallback className="text-primaryColor bg-primaryColor/10 font-bold">{name.charAt(0)}</AvatarFallback>
        </UiAvatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-2" align="end">
        <div className="flex items-center gap-3 p-2">
          <UiAvatar className="h-10 w-10">
            <AvatarImage src={image} alt={name} referrerPolicy="no-referrer" />
            <AvatarFallback className="text-primaryColor bg-primaryColor/10 font-bold">{name.charAt(0)}</AvatarFallback>
          </UiAvatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">{name}</span>
            <span className="text-xs text-muted-foreground truncate">{email}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <div className="flex items-center justify-between rounded-md bg-secondary/50 p-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-yellow-100 p-1">
                <Coins className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-sm font-medium">Credits</span>
            </div>
            <span className="text-sm font-bold text-primaryColor">{credits.toFixed(1)}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 p-2 rounded-md">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
