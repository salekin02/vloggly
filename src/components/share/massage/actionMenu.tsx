// src/components/share/massage/actionMenu.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalCircle01Icon } from "hugeicons-react";
import { useMassageStore } from "@/data";
import { toast } from "sonner";
import { useSocket } from "@/hook/useSocket";
import { fetchSubscriberRooms } from "@/services";

interface DropdownOption {
  label: string | (() => string);
  icon?: React.ReactElement;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  direction: "top" | "left" | "right" | "bottom";
  id: string; // messageId or roomId depending on context
}

export function ActionMenu({ options, direction, id }: CustomDropdownProps) {
  const {
    addPinned,
    pinnedList,
    removePinned,
    likedList,
    addLiked,
    removeLiked,
    clickedMsg,
    addHidden,
    SetSavedDialogOpen,
    setIsReplied,
    addReplying,
    addRestricted,
    remnoveRestricted,
    restricted,
    setpopUpactions,
    setPopupOpen,
  } = useMassageStore();

  const { messages } = useSocket(clickedMsg);

  // Determine if id is a messageId or roomId
  const selectedMessage = messages.find((msg) => msg._id === id);
  const isMessageAction = !!selectedMessage;

  // Fetch room details for profile link if needed
  const getRoomDetails = async () => {
    const response = await fetchSubscriberRooms();
    if (response.success) {
      return response.data.find((room) => room.roomId === clickedMsg);
    }
    return null;
  };

  // Copy message text
  const copyToClipboard = async () => {
    console.log(id);
    if (!selectedMessage) {
      toast.error("No message selected to copy");
      return;
    }
    await navigator.clipboard.writeText(selectedMessage.text || "");
    toast.success("Successfully copied the text to your clipboard", {
      position: "top-center",
      duration: 2000,
    });
  };

  // Copy profile link
  const handleCopyProfile = async () => {
    const room = await getRoomDetails();
    if (room) {
      const profileLink = `${location?.origin}/public/${room.creator?.username}`;
      await navigator.clipboard.writeText(profileLink);
      toast.success("Successfully copied the profile link to your clipboard", {
        position: "top-center",
        duration: 2000,
      });
    } else {
      toast.error("Failed to fetch profile link");
    }
  };

  // Add or remove from collection
  const handleAddorRemoveFromList = () => {
    SetSavedDialogOpen(true);
  };

  // Like message
  const handleLiked = () => {
    if (isMessageAction) {
      addLiked(id);
      if (likedList.includes(id)) removeLiked(id);
    }
  };

  // Reply to message
  const handleReply = () => {
    if (isMessageAction) {
      setIsReplied(true);
      addReplying("targetId", id); // Adjust "targetId" if needed
    }
  };

  // Pin message
  const handlePinned = () => {
    if (isMessageAction) {
      addPinned(id);
      if (pinnedList.includes(id)) removePinned(id);
    }
  };

  // Hide chat or message
  const handleHide = () => {
    addHidden(isMessageAction ? id : clickedMsg || "");
  };

  // Restrict chat
  const handleRestrict = () => {
    const targetId = isMessageAction ? clickedMsg || "" : id;
    addRestricted(targetId);
    if (restricted.includes(targetId)) remnoveRestricted(targetId);
  };

  // Report
  const handleReport = () => {
    setPopupOpen(true);
    setpopUpactions("isReport", true);
    setpopUpactions("isDelete", false);
    setpopUpactions("isBlock", false);
  };

  // Block
  const handleBlock = () => {
    setPopupOpen(true);
    setpopUpactions("isBlock", true);
    setpopUpactions("isReport", false);
    setpopUpactions("isDelete", false);
  };

  // Delete chat
  const handleDelete = () => {
    setPopupOpen(true);
    setpopUpactions("isReport", false);
    setpopUpactions("isBlock", false);
    setpopUpactions("isDelete", true); // Ensure this triggers delete
  };

  // Action handler
  const handleAction = (action: string | (() => string)): void => {
    const actionLabel = typeof action === "function" ? action() : action;
    switch (actionLabel) {
      case "Copy":
        copyToClipboard();
        break;
      case "Pin Chat":
        handlePinned();
        break;
      case "Like":
        handleLiked();
        break;
      case "Reply":
        handleReply();
        break;
      case "Hide Chat": // Adjusted from "Hide" to match MassageBody
        handleHide();
        break;
      case "Copy Link Profile":
        handleCopyProfile();
        break;
      case "Add or Remove from list":
        handleAddorRemoveFromList();
        break;
      case "Restrict Chat":
      case "Unrestrict Chat":
        handleRestrict();
        break;
      case "Report":
        handleReport();
        break;
      case "Block":
        handleBlock();
        break;
      case "Delete Chat":
        handleDelete();
        break;
      default:
        console.warn("Unknown action:", actionLabel);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <MoreVerticalCircle01Icon size={24} fill="white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-fit" align="start" side={direction}>
        {options.map((option, index) => (
          <DropdownMenuItem
            className="cursor-pointer font-sm font-medium flex items-center gap-2"
            key={index}
            onClick={() => handleAction(option.label)}
          >
            {option.icon}
            {typeof option.label === "function" ? option.label() : option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
