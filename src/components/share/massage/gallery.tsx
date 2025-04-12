"use client";

import { useState } from "react";
import Image from "next/image";
import { Image01Icon, Video01Icon } from "hugeicons-react";

interface MediaItem {
  id: string;
  src: string;
  type: "image" | "video";
  isPaid: boolean;
  price: number;
}

interface GalleryProps {
  mediaItems: MediaItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ mediaItems }) => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  const filters = ["All", "Unlocked", "Photos", "Videos"];

  const filteredItems = mediaItems.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unlocked") return !item.isPaid;
    if (activeFilter === "Photos") return item.type === "image";
    if (activeFilter === "Videos") return item.type === "video";
    return true;
  });

  const LockedContent = () => {
    return (
      <>
        <div
          className={`relative lg:w-[192px] w-[192px] h-[198px] rounded-lg overflow-hidden flex items-center justify-center bg-[url('/assets/images/gallery1.jpg')] bg-cover bg-center`}
        >
          <div className="absolute inset-0 h-full w-full bg-white/10 backdrop-blur-[78px]"></div>
          {/* <SquareLock01Icon className="z-10" color="white" size={30} /> */}
          <div className={` absolute w-[95%] bottom-2 left-2 text-xs z-10`}>
            {/* <div className="flex justify-between items-center text-white font-medium text-sm">
              <div className="flex gap-2.5">
                <Video02Icon size={20} color="white" />
                7:10
              </div>
              <span>${price}</span>
            </div> */}
            {/* <button
              className="w-full bg-brand-500 mt-2 py-2 cursor-pointer rounded-lg text-white font-medium text-sm z-10"
              onClick={() => setOpendialog(true)}
            >
              Unlock for ${price}
            </button> */}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="h-[692px] overflow-auto bg-white">
      {/* Filters */}
      <div className="flex space-x-2 bg-white p-4 overflow-auto">
        {filters.map((filter, index) => (
          <button
            key={index}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition ${
              activeFilter === filter
                ? "bg-brand-50 text-brand"
                : "bg-neutral-200 text-black"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-1 px-1 pb-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="relative h-[198px] overflow-hidden"
            onMouseEnter={() => setHoveredVideo(item.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            {/* Media */}

            {item.type === "image" && !item.isPaid ? (
              <Image
                src={item.src}
                alt="Gallery Image"
                width={195}
                height={198}
                className="w-full h-full object-cover"
              />
            ) : item.isPaid ? (
              LockedContent()
            ) : null}
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt="Gallery Image"
                width={195}
                height={198}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={item.src}
                className="w-full h-full object-cover"
                muted
                loop
                controls={hoveredVideo === item.id}
              />
            )}

            {/* Overlay: Paid Indicator */}
            {item.isPaid && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-[10px] px-2 py-1 rounded">
                {item.price > 0 ? ` €${item.price}` : ""}
              </div>
            )}

            {/* Overlay: Media Type Icon */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white p-1 rounded flex items-center gap-1 text-xs">
              {item.type === "image" ? (
                <Image01Icon size={12} />
              ) : (
                <Video01Icon size={12} />
              )}
              <span>{item.type === "image" ? "Photo" : "Video"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
