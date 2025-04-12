// src/components/share/massage/massageInput/ImageInput.tsx
"use client";

import { Delete02Icon, PencilEdit02Icon, PlusSignIcon } from "hugeicons-react";
import Image from "next/image";
import { useRef, useEffect, createRef } from "react";

interface ImageUploadProps {
  images: File[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (index: number) => void;
  setImage: (value: React.SetStateAction<File[]>) => void;
  uploadProgress?: number[];
  isSending?: boolean;
}
export const ImageInput = ({
  images,
  onDelete,
  onImageUpload,
  setImage,
  uploadProgress = [],
  isSending = false,
}: ImageUploadProps) => {
  const fileInputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);

  useEffect(() => {
    fileInputRefs.current = images.map(
      (_, i) => fileInputRefs.current[i] || createRef<HTMLInputElement>()
    );
  }, [images]);

  const handleEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.target.files?.length) return;
    const updatedImage = [...images];
    updatedImage[index] = e.target.files[0];
    setImage(updatedImage);
  };

  return (
    <div className="w-full overflow-auto">
      <div className="flex gap-2 w-max">
        {images.map((image, index) => (
          <div
            className="flex relative w-35 h-35 rounded-lg overflow-hidden border"
            key={index}
          >
            <Image
              src={URL.createObjectURL(image)}
              alt="Selected"
              width={34}
              height={36}
              className="h-full w-full object-cover rounded-[6px]"
            />
            {isSending && uploadProgress[index] < 100 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-gray-200"
                      strokeWidth="2"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-brand-600"
                      strokeWidth="2"
                      strokeDasharray="100"
                      strokeDashoffset={100 - (uploadProgress[index] || 0)}
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                    {Math.round(uploadProgress[index] || 0)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute top-1 right-1 grid h-[95%] content-between">
                <div
                  className="w-[25px] rounded-[24px] bg-danger-50 p-1 cursor-pointer"
                  onClick={() => onDelete(index)}
                >
                  <Delete02Icon size={16} color="red" />
                </div>
                <div
                  className="w-[25px] rounded-[24px] bg-brand-50 p-1 cursor-pointer"
                  onClick={() => fileInputRefs.current[index]?.current?.click()}
                >
                  <PencilEdit02Icon size={16} color="#0069D1" />
                </div>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={fileInputRefs.current[index]}
              onChange={(e) => handleEdit(e, index)}
            />
          </div>
        ))}
        <label className="w-13 h-35 flex items-center justify-center rounded-[8px] cursor-pointer bg-neutral-200">
          <PlusSignIcon className="text-gray-500" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={onImageUpload}
          />
        </label>
      </div>
    </div>
  );
};
