import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Public | Vloggly",
};

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}