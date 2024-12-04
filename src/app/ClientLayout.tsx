/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect } from "react";
import AnimatedRobot from "@/components/AnimatedRobot";
import Link from "next/link";
import { initAmplitude, logEvent } from "@/lib/amplitude";
import { PrivyProvider } from "@privy-io/react-auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";

// Create a separate header component to use hooks
function Header() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="flex justify-between items-center px-4">
        <Link href="/" className="text-xl font-bold">
          <div className="flex flex-row max-h-16 items-center space-x-0 text-black hover:text-purple-600 transition-colors">
            <AnimatedRobot scale={0.45} />
            agentscan
          </div>
        </Link>

        <div className="flex items-center gap-4">
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

          {isAuthenticated ? (
            <Button
              variant="ghost"
              onClick={logout}
              className="text-black hover:text-purple-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                login();
              }}
              className="text-black hover:text-purple-600 transition-colors"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

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
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#A855F7", // Purple to match your theme
          showWalletLoginFirst: false,
        },
      }}
    >
      <body
        className={`${geistSansVariable} ${geistMonoVariable} min-h-screen flex flex-col`}
      >
        <Header />

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
    </PrivyProvider>
  );
}
