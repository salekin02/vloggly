// src/components/share/massage/massageInput/Input-gif.tsx
"use client";

import { SearchBar } from "../../common/searchBar";
import { MultiplicationSignIcon } from "hugeicons-react";
import Image from "next/image";

const gifs = [
  "/assets/images/eyebrows-raise.gif",
  "/assets/images/goodmorning.gif",
  "/assets/images/ill-download-it.gif",
];

export const InputGIF = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="w-full">
      <div className="flex gap-2 items-center pb-4 h-[60px] w-[99%]">
        <MultiplicationSignIcon onClick={onClick} className="cursor-pointer" />
        <SearchBar />
      </div>
      <div className="flex gap-2 h-[130px] w-full overflow-auto">
        {gifs.map((gif, i) => (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}${gif}`}
            key={i}
            alt="Gallery item"
            width={340}
            height={130}
            className="object-cover rounded-[6px]"
          />
        ))}
      </div>
    </div>
  );
};
