import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {
  Topbar,
  LeftSidebar,
  RightSidebar,
  Bottombar,
} from "@/components/shared";
import { store } from "@/lib/redux/store";
import { Providers } from "@/lib/redux/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Chef",
  description: "Created by Fastlancer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className={inter.className}>
            <Topbar />
            <main className="flex flex-row">
              <LeftSidebar />
              <section className="main-container">
                <div className="w-full max-w-5xl">{children}</div>
              </section>
              {/* <RightSidebar /> */}
            </main>
            <Toaster />

            <Bottombar />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
