"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/data";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Verified } from "../../../../public/assets/icons";
import { setCookie } from "cookies-next";

const ProfileSetup = () => {
    const router = useRouter();

    const {
        user,
        currentSignupData
    } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const { data } = currentSignupData || {};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setCookie("isAuthenticated", "true");
        router.push("/");
    };

    return (
        <div className="w-[400px] border rounded-[20px] border-neutral-400 border-t-0">
            <Image
                src="/assets/images/cover.png"
                alt=""
                width={640}
                height={200}
                className="w-full h-32"
            />
            <div className="p-5 pt-2.5 relative rounded-b-[20px] bg-white">

                <div className="absolute -top-6 left-4">
                    <Avatar className="w-17.5 h-17.5 items-center justify-center bg-brand-50 border-0">
                        {/* <UserIcon strokeWidth={2} className="w-[30px] h-8 text-brand" /> */}
                        <AvatarImage
                            width={30}
                            height={30}
                            className="rounded-[50]"
                            src={user?.profilePicture || data?.user?.profilePicture}
                            alt="@shadcn"
                        />
                    </Avatar>

                </div>
                <div className="ml-20 mb-7.5">
                    <div className="flex items-center gap-0.5">
                        <span className="leading-5 text-sm font-medium">{data?.user?.name}</span>
                        <Verified className="h-4 w-4 fill-[#0073e6] text-white" />
                    </div>
                    <span className="text-neutral-800 text-sm leading-5">{data?.user?.username}</span>
                </div>


                <Button
                    onClick={handleSubmit}
                    type="submit"
                    className="bg-brand h-11 w-full rounded-full text-white hover:bg-[#0069d1] font-medium transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? "Setting up your profile..." : "Next"}
                </Button>
            </div>

        </div>

    );
};

export default ProfileSetup;