import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/context/authcontext";
import { Toaster } from "sonner";

const APP_NAME = "Rive";
const APP_DEFAULT_TITLE = "Rive - Lift Tracker";
const APP_TITLE_TEMPLATE = "%s - Rive - Lift Tracker";
const APP_DESCRIPTION =
  "Track your lifts and progress with Rive, the ultimate lift tracking app.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
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
