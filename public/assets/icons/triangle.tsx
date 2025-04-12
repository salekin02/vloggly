import React from "react";

interface TriangleProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number;
}

export const Triangle = ({
  color = "currentColor",
  size = 24,
  ...props
}: TriangleProps) => {
  const height = size * 0.9; // Maintain aspect ratio (original is 20:18)

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        id="Polygon 1"
        d="M10.8314 16.56C10.4619 17.2 9.53812 17.2 9.16862 16.56L0.439081 1.44C0.0695763 0.800001 0.531456 0 1.27047 0L18.7295 0C19.4685 0 19.9304 0.799999 19.5609 1.44L10.8314 16.56Z"
        fill={color}
      />
    </svg>
  );
};
