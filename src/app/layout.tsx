import type { Metadata } from "next";
import "./globals.css";
import ViewportFixer from "../lib/ViewportFixer";
import { AuthProvider } from "@/app/context/AuthContext";
import { UIProvider } from "./context/UIContext";

export const metadata: Metadata = {
  title: "VirtuSense",
  icons: {
    icon: "/logo.png"
  },
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="lofi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ViewportFixer />
        <AuthProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
