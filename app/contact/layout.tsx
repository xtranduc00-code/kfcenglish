import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Contact | Portfolio",
    description: "Email, GitHub, LinkedIn — get in touch.",
};
export default function ContactLayout({ children }: {
    children: React.ReactNode;
}) {
    return children;
}
