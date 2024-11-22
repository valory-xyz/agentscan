"use client";

import React from "react";
import AnimatedRobot from "@/components/AnimatedRobot";
import Link from "next/link";

interface ClientLayoutProps {
  children: React.ReactNode;
  geistSansVariable: string;
  geistMonoVariable: string;
}

export default function ClientLayout({
  children,
  geistSansVariable,
  geistMonoVariable,
}: ClientLayoutProps) {
  return (
    <body
      className={`${geistSansVariable} ${geistMonoVariable} min-h-screen flex flex-col`}
    >
      <div className="fixed top-0 left-0 w-full bg-transparent z-50">
        <div className="">
          <Link href="/" className="text-xl font-bold">
            <div className="flex flex-row max-h-16 items-center space-x-0">
              <AnimatedRobot scale={0.45} />
              agentscan
            </div>
          </Link>
        </div>
      </div>

      <main className="flex-1 mt-20 flex flex-col">{children}</main>

      <footer className="w-full py-4 bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            agentscan is a community-driven informational site separate to
            Autonolas (OLAS), Valory AG or any related products & services. All
            information and chats are not financial advice. Use at your own
            risk.
          </p>
        </div>
      </footer>
    </body>
  );
}
