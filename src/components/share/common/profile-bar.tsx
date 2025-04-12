import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

import {
  Bookmark02Icon,
  UserIcon,
  CreditCardIcon,
  Settings01Icon,
  HelpCircleIcon,
  Logout01Icon,
  GlobalIcon,
  StartUp02Icon,
  Moon02Icon,
} from "hugeicons-react";

import { useAuthStore, resetAllStores } from "@/data";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileBar = ({
  onOpen,
}: {
  onOpen: (value: boolean) => void;
}) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const logout = () => {
    // Reset all stores and clear cookies
    resetAllStores();

    // Clear query cache
    queryClient.clear();

    // Redirect to login page
    window.location.href = "/sign-in";
  };

  return (
    <div className="flex flex-col space-y-1">
      <div
        className="p-2.5 cursor-pointer flex items-center"
        onClick={() => {
          router.push(`/my-profile/${user?.name}`);
          onOpen(false);
        }}
      >
        <UserIcon className="mr-3 h-5 w-5" />
        <span className="font-medium text-sm">My Profile</span>
      </div>
      <div
        className="p-3 cursor-pointer flex items-center"
        onClick={() => {
          router.push("/collection");
          onOpen(false);
        }}
      >
        <Bookmark02Icon className="mr-3 h-5 w-5" />
        <span className="font-medium text-sm">Collection</span>
      </div>
      <div
        className="p-3 cursor-pointer flex items-center"
        onClick={() => {
          router.push("/settings");
          onOpen(false);
        }}
      >
        <Settings01Icon className="mr-3 h-5 w-5" />
        <span className="font-medium text-sm">Settings</span>
      </div>

      <div
        className="p-3 cursor-pointer flex items-center justify-between border-t"
        onClick={() => {
          router.push("/card");
          onOpen(false);
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center">
            <CreditCardIcon className="mr-3 h-5 w-5" />
            <span className="font-medium text-sm">
              Your Cards{" "}
              <span className="text-xs text-muted-foreground">
                (to subscribe)
              </span>
            </span>
          </div>
        </div>
      </div>

      <div
        className="p-3 cursor-pointer flex items-center justify-between border-b"
        onClick={() => {
          router.push("/become-creator");
          onOpen(false);
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center">
            <StartUp02Icon className="mr-3 h-5 w-5" />
            <span className="font-medium text-sm">
              Become a Creator{" "}
              <span className="text-xs text-muted-foreground">(to earn)</span>
            </span>
          </div>
        </div>
      </div>

      <div
        className="p-3 cursor-pointer flex items-center"
        onClick={() => {
          router.push("/support");
          onOpen(false);
        }}
      >
        <HelpCircleIcon className="mr-3 h-5 w-5" />
        <span className="font-medium text-sm">Help and Support</span>
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Moon02Icon className="mr-3 h-5 w-5" />
          <span className="font-medium text-sm">Dark Mode</span>
        </div>
        <Switch
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </div>

      <div className="p-3 cursor-pointer flex items-center">
        <GlobalIcon className="mr-3 h-5 w-5" />
        <span className="font-medium text-sm">English</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-auto h-4 w-4"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div
        className="p-3 cursor-pointer text-red-500 flex items-center border-t"
        onClick={logout}
      >
        <Logout01Icon className="mr-3 h-5 w-5" />
        <span className="font-medium text-sm">Log Out</span>
      </div>
    </div>
  );
};
