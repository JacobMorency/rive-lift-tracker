import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/context/authcontext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Project Hyper",
  description: "Track your fitness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="projecthyperpink">
      <body className="bg-base-200">
        <Toaster richColors position="top-center" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
