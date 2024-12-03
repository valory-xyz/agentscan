/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect } from "react";
import AnimatedRobot from "@/components/AnimatedRobot";
import Link from "next/link";
import { initAmplitude, logEvent } from "@/lib/amplitude";

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
  useEffect(() => {
    initAmplitude();
  }, []);

  return (
    <body
      className={`${geistSansVariable} ${geistMonoVariable} min-h-screen flex flex-col`}
    >
      <div className="fixed top-0 left-0 w-full bg-transparent z-50">
        <div className="flex justify-between items-center px-4">
          <Link href="/" className="text-xl font-bold">
            <div className="flex flex-row max-h-16 items-center space-x-0 text-black hover:text-purple-600 transition-colors">
              <AnimatedRobot scale={0.45} />
              agentscan
            </div>
          </Link>

          <a
            href="https://t.me/ExploreSupport"
            target="_blank"
            className="text-md text-black hover:text-purple-600 transition-colors font-bold"
            onClick={() => {
              logEvent("external_link_clicked", {
                url: "https://t.me/ExploreSupport",
                context: "feedback_link",
                teamId: process.env.NEXT_PUBLIC_TEAM_ID || "",
              });
            }}
          >
            Give Feedback
          </a>
        </div>
      </div>

      <main className="flex-1 mt-20 flex flex-col">{children}</main>

      <footer className="w-full py-4 bg-muted/50 mt-auto fixed bottom-0">
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground">
              Copyright Explore Labs, Inc 2024 •{" "}
              <Link 
                href="/disclaimer" 
                className="hover:text-purple-600 transition-colors"
                onClick={() => {
                  logEvent("internal_link_clicked", {
                    url: "/disclaimer",
                    context: "footer_disclaimer",
                    teamId: process.env.NEXT_PUBLIC_TEAM_ID || "",
                  });
                }}
              >
                Disclaimer & Privacy Policy
              </Link>
            </p>
          </div>
        </div>
        <a
          href="https://olas.network"
          target="_blank"
          className="absolute right-14 bottom-4"
          onClick={() => {
            logEvent("external_link_clicked", {
              url: "https://olas.network",
              context: "footer_link",
              teamId: process.env.NEXT_PUBLIC_TEAM_ID || "",
            });
          }}
        >
          <img src="/olas.svg" alt="Autonolas" className="h-9" />
        </a>
      </footer>
    </body>
  );
}
