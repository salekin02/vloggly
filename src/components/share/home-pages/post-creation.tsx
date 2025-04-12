import {
  Image01Icon,
  AlignLeftIcon,
  PuzzleIcon,
  TextFontIcon,
} from "hugeicons-react";
import { useState } from "react";
import { CreatorProfile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCreationProps {
  creator: CreatorProfile;
}

export const PostCreation = ({ creator }: PostCreationProps) => {
  const [postText, setPostText] = useState("");

  return (
    <div className="mb-2 bg-white p-4">
      <div className="gap-3">
        <div className=" flex rounded">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={creator.profilePicture}
              alt={creator.name}
              className="object-cover"
            />
            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="mb-3 rounded-[20] p-2 w-full">
            <textarea
              placeholder="What do you think?"
              className="w-full resize-none text-neutral-800 outline-none"
              rows={2}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button className="rounded-md p-2 hover:bg-brand-50 cursor-pointer">
                <Image01Icon color="#e2e2e2" />
              </button>
              <button className="rounded-md p-2 hover:bg-brand-50 cursor-pointer">
                <AlignLeftIcon color="#e2e2e2" />
              </button>
              <button className="rounded-md p-2 hover:bg-brand-50 cursor-pointer">
                <PuzzleIcon color="#e2e2e2" />
              </button>
              <button className="rounded-md p-2 hover:bg-brand-50 cursor-pointer">
                <TextFontIcon color="#e2e2e2" />
              </button>
            </div>
            <button className="bg-brand rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-brand cursor-pointer">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
