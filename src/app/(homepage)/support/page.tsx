import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Vloggly",
};

export default function Support() {
  return (
    <div className="w-[598px]">
      <div className="flex items-center justify-center p-4 bg-gray-100 border border-gray-300 rounded-lg">
        {/* Info Icon */}
        <svg
          className="w-6 h-6 mr-2 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-center text-lg text-gray-700">
          This feature is currently being developed and will be launched soon!
        </p>
      </div>
    </div>
  );
}
