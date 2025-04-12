"use client";

import {
    HelpCircleIcon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";

const Template = ({ children }: { children: React.ReactNode }) => {
    // Post data for more realistic content
    // const posts = [
    //     {
    //         id: 1,
    //         author: "Jeniferr Hills",
    //         username: "jeniferrhills002",
    //         verified: true,
    //         time: "5h ago",
    //         text: "They say curiosity killed the cat... but did you know satisfaction brought it back? 😉 #GoodTimes #FromCreatorstoFans",
    //         image: "/assets/images/post-banner-1.png",
    //         profilePic: "/assets/images/user1.png",
    //     },
    //     {
    //         id: 2,
    //         author: "Jeniferr Hills",
    //         username: "jeniferrhills002",
    //         verified: true,
    //         time: "5h ago",
    //         text: "They say patience is a virtue, but why wait? Good things come to those who subscribe—exclusive content, special perks! 🎉✨",
    //         image: "/assets/images/post-banner-2.png",
    //         profilePic: "/assets/images/user2.png",
    //         taggedUsers: [{
    //             profilePic: "/assets/images/user4.png",
    //             username: "@jeniferrhills002"
    //         }],
    //     },
    //     {
    //         id: 3,
    //         author: "Jeniferr Hills",
    //         username: "jeniferrhills002",
    //         verified: true,
    //         time: "5h ago",
    //         text: "This is for the bold, the daring, the ones who know exactly what they want—and aren't afraid to claim it 💯. #GoodTimes #FromCreatorstoFans",
    //         image: "/assets/images/post-banner-3.png",
    //         profilePic: "/assets/images/user3.png",
    //     },
    // ];

    return (
        <main className="flex min-h-screen flex-col sm:flex-row justify-between bg-brand relative overflow-hidden">
            {/* Left Section - Blue Background with Content */}
            <div className="w-full md:w-[55.56%] text-white p-4 pt-5 lg:p-14.5 flex-col relative overflow-hidden sm:flex">
                <div className="select-none relative z-10 max-w-[784px]">
                    <div className="sm:pl-2 md:pb-10 lg:pb-0">
                        {/* Logo */}
                        <Link href="/">
                            <div className="mb-5 md:mb-12">
                                <Image src="/assets/images/logo.svg" width={150} height={24} alt="Vloggly" />
                            </div>
                        </Link>

                        {/* Main Text */}
                        <div className="space-y-2 mb-20 sm:mb-6">
                            <h2 className="text-white text-lg sm:text-[30px] font-semibold sm:leading-[40px] tracking-[-1.28px]">
                                Unforgettable moments & great vibes
                                <br />
                                All in our best platform!
                            </h2>
                        </div>

                        {/* <div className="hidden sm:block">
                            <p className="text-[16px] font-normal leading-[24px] tracking-[-0.24px] text-[#DCDCDC]">
                                Support your favorite creators with Endastfans! 🍾🥂
                                <br></br>
                                #GoodTimes #FromCreatorstoFans
                            </p>
                        </div> */}
                    </div>


                    {/* <div className="relative mb-54 hidden sm:block">
                        <div className="absolute -top-34 right-5 flex items-end flex-col">
                            <div className="relative bg-white mb-4 text-black px-3 py-2.5 rounded-full">
                                <Triangle
                                    color="#fff"
                                    className="text-brand-50 absolute top-0 -right-0.5"
                                />
                                Hi!
                            </div>
                            <div className="relative bg-white mb-4 text-black px-3 py-2.5 rounded-full">
                                <Triangle
                                    color="#fff"
                                    className="text-brand-50 absolute top-0 -right-0.5"
                                />
                                Your work is super Good!
                            </div>
                        </div>

                        <div className="relative mt-24 flex flex-wrap justify-center sm:justify-between gap-7.5 pb-4">
                            {posts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className="relative bg-white rounded-md text-black w-full sm:w-[45%] lg:w-[208px] flex flex-col shadow-lg mb-8 sm:mb-4 lg:mb-0"
                                >
                                    {index === 0 && (
                                        <div className="absolute z-9 -top-4 -right-4">
                                            <div className="relative text-base bg-brand-50 mb-4 text-black px-3 py-2.5 rounded-full">
                                                <Triangle
                                                    color="#E6F1FD"
                                                    className="text-brand-50 absolute top-0 -left-0.5"
                                                />
                                                Hi! <span className="text-amber-500">😍</span>
                                            </div>
                                        </div>
                                    )}

                                    {index === 1 && <div className="z-9 absolute -bottom-7.5 -right-4 bg-brand-50 rounded-full px-3 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                                        <div className="flex items-center space-x-1">
                                            <span className="">
                                                <DollarCircleIcon className="w-8 h-8 text-[#141B34]" />
                                            </span>
                                            <span className="font-normal text-base text-black">
                                                Send gift
                                            </span>
                                        </div>
                                    </div>}

                                    <div className="p-2 flex items-center">
                                        <div className="flex items-center flex-1">
                                            <div className="w-[24px] h-[24px] bg-gray-300 rounded-full overflow-hidden relative">
                                                <Image
                                                    src={post.profilePic}
                                                    alt={post.author}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="ml-2">
                                                <div className="flex items-center">
                                                    <p className="text-[7px] font-[500] leading-[10.109px] tracking-[-0.035px] text-neutral-1000">
                                                        {post.author}
                                                    </p>
                                                    {post.verified && (
                                                        <span className="ml-1 text-blue-500">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                className="w-2 h-2"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[7px] font-[400] leading-[10.109px] tracking-[-0.035px] text-[#545454] ">
                                                    @{post.username}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-[7px] font-[400] leading-[9.098px] tracking-[-0.106px] text-[#545454] ">
                                                {post.time}
                                            </div>
                                            <button className="text-gray-500">
                                                <MoreHorizontalSquare01Icon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>


                                    <div className="px-2 pb-2">
                                        <p className="text-[7px] font-[400] leading-[10.109px] tracking-[-0.035px] text-neutral-1000 line-clamp-3">
                                            {post.text}
                                        </p>
                                    </div>

                                    <div className="h-40 bg-gray-200 relative">
                                        <Image
                                            src={post.image}
                                            alt="Post content"
                                            fill
                                            className="object-cover"
                                        />

                                        {index === 1 && (
                                            <div className="absolute bottom-3 left-3 flex items-center">
                                                <div className="bg-white bg-opacity-50 text-white rounded-full p-1">
                                                    <UserAdd01Icon color="#141B34" size={10} />
                                                </div>
                                                <div className="flex ml-0.5">
                                                    {post.taggedUsers?.map((user, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex gap-1 bg-white bg-opacity-50 text-neutral-800 text-[7px] pl-[3px] pr-1.5 py-[3px] rounded-full"
                                                        >
                                                            <Image width={12} height={12} src={user.profilePic} alt={user.username} />
                                                            {user.username}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-2 flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <button className="text-[#141B34] hover:text-red-500 transition-colors">
                                                <ThumbsUpIcon className="h-3 w-3" />
                                            </button>
                                            <button className="text-[#141B34] hover:text-blue-500 transition-colors">
                                                <Message01Icon className="h-3 w-3" />
                                            </button>

                                            <button className="text-[#141B34] hover:text-yellow-500 transition-colors">
                                                <Bookmark02Icon className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex gap-1 items-center">
                                                <DollarCircleIcon className="h-3 w-3 text-[#141B34]" />
                                                <span className="text-[7px]">Send gift</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div> */}
                </div>
            </div>

            {/* Background Watermark */}
            <div
                className="absolute scale-150 -left-0.5 top-37 sm:left-0 sm:scale-100 sm:top-auto sm:-bottom-1"
            >
                <Image className="opacity-20" src="/assets/images/logo-watermark.svg" width={917} height={147} alt="Vloggly Watermark" />
            </div>

            {/* Mobile Logo - Only visible on small screens */}
            {/* <div className="md:hidden bg-brand text-white p-6 text-center">
                <h1 className="font-[Agbalumo] text-[37.063px] leading-[31.769px] font-normal mb-8 md:mb-16">
                    <span className="opacity-80">Endast</span>Fans
                </h1>
                <p className="text-[16px] font-normal leading-[24px] tracking-[-0.24px] text-[#DCDCDC] mt-2">Support your favorite creators</p>
            </div> */}

            {/* Right Section - Login Form */}
            <div className="w-full md:w-[44.44%] z-9 bg-neutral-200 p-0 sm:p-6 flex flex-col justify-center items-center">
                <div className="w-full max-w-md items-center justify-center p-4">
                    {/* Help icon in top right */}
                    <div className="absolute right-4 top-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-brand-50 p-2.5 text-brand border border-transparent hover:border-brand-500 active:shadow-[0px_0px_0px_4px_rgba(0,115,230,0.20)]"
                        >
                            <HelpCircleIcon
                                strokeWidth={2}
                                className="h-6 w-6 text-brand-600"
                            />
                        </Button>
                    </div>

                    {children}
                </div>
            </div>
        </main>
    );
}

export default Template;