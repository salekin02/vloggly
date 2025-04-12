// import Lottie from "lottie-react";
import animationData from "../../../../public/assets/images/3yytDdQPYw.json"; // Import your Lottie JSON file

// components/LottieAnimation.tsx
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-100 animate-pulse" />, // Fallback while loading
});

export default function Loading({ width }: { width: string }) {
  return (
    <div className={`flex justify-center items-center h-64 w-[${width}]`}>
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ height: 120 }}
      />
    </div>
  );
}
