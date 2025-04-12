"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useLightboxStore } from "@/data";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

const Lightbox = () => {
  const { images, isOpen, closeLightbox } = useLightboxStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  // const { isMobile } = useMassageStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const imageArray = typeof images === "string" ? [images] : (images ?? []);
  const totalImages = imageArray.length;

  const handleImageChange = (direction: "next" | "prev") => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        direction === "next"
          ? (prevIndex + 1) % totalImages
          : (prevIndex - 1 + totalImages) % totalImages
      );
      setIsZoomed(false);
      setIsTransitioning(false);
    }, 200); // transition duration must match CSS
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => totalImages > 1 && handleImageChange("next"),
    onSwipedRight: () => totalImages > 1 && handleImageChange("prev"),
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  if (!isOpen || !images) return null;

  const toggleZoom = () => setIsZoomed((prev) => !prev);

  return (
    <Dialog open={isOpen} onOpenChange={closeLightbox}>
      <DialogTitle className="hidden" />

      <DialogContent
        {...swipeHandlers}
        className="flex items-center justify-center bg-black/.2 border-none rounded-none p-0 focus:outline-0"
      >
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black transition z-10 lg:hidden"
        >
          <X size={24} />
        </button>
        {totalImages > 1 && (
          <button
            onClick={() => handleImageChange("prev")}
            className="absolute -left-90 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black transition"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        {/* Desktop View */}
        <div className="hidden lg:flex relative max-w-5xl w-full justify-center">
          <div
            className={`transition-all duration-300 ${
              isZoomed ? "scale-300" : "scale-200"
            } ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            onClick={toggleZoom}
          >
            <Image
              src={imageArray[currentIndex]}
              alt={`Preview ${currentIndex + 1}`}
              width={900}
              height={600}
              className="object-contain max-h-[90vh] w-auto cursor-zoom-in"
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden relative max-w-5xl w-full justify-center">
          <div
            className={`transition-opacity duration-300 h-screen w-full z-10 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <Image
              src={imageArray[currentIndex]}
              alt={`Preview ${currentIndex + 1}`}
              width={900}
              height={600}
              className="object-cover h-full w-full cursor-zoom-in"
            />
          </div>
        </div>
        {totalImages > 1 && (
          <button
            onClick={() => handleImageChange("next")}
            className="absolute -right-90 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black transition"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Lightbox;
