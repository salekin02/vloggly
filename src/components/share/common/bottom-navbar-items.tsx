"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavItemProps {
  children: React.ReactNode;
  path: string;
}

export const BottomNavItem: React.FC<SidebarNavItemProps> = ({
  children,
  path,
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={path}
      className={`transition delay-100 duration-300 ease-in-out
        ${pathname === path && "text-brand-600"}`}
    >
      {children}
    </Link>
  );
};
