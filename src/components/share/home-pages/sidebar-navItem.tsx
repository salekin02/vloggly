"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavItemProps {
  children: React.ReactNode;
  path: string;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  children,
  path,
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={path}
      className={`flex items-center rounded-[50] p-3 hover:text-brand-600 transition delay-100 duration-300 ease-in-out
        ${pathname === path && "bg-brand-50 text-brand-600"}`}
    >
      {children}
    </Link>
  );
};
