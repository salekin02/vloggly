import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Add Card | Vloggly",
};

export default function AddCardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}