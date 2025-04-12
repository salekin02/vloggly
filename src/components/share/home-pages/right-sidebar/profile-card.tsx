import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Verified } from "../../../../../public/assets/icons";

export const ProfileCard = ({
  profile,
}: {
  profile: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
    profileBanner: string;
    verified: boolean;
    free: boolean;
  };
}) => {
  return (
    <div className="mb-4 rounded-[20] overflow-hidden border border-[#151515]/10 bg-white">
      <div className="relative cursor-pointer">
        <Image
          src={profile.profileBanner || "/placeholder.svg"}
          alt=""
          width={640}
          height={200}
          className="w-full h-18.75 object-cover"
        />
        {profile.free && (
          <Badge className="absolute top-4 left-4 bg-white text-[#0073e6] hover:bg-white/90 font-semibold text-xs px-2 py-1 rounded-full z-10">
            Free
          </Badge>
        )}
      </div>
      <div className="pt-2.5 pb-5 flex items-center gap-4 relative">
        <div className="absolute -top-5 left-4 cursor-pointer">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={profile.profileImage}
              alt={profile.name}
              className="object-cover"
            />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-26">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-neutral-1000">{profile.name}</h3>
            {profile.verified && (
              <Verified className="h-5 w-5 fill-[#0073e6] text-white" />
            )}
          </div>
          <p className="text-[#545454] text-sm">{profile.username}</p>
        </div>
      </div>
    </div>
  );
};
