/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import AnimatedRobot from "@/components/AnimatedRobot";
import Link from "next/link";
import { PrivyProvider } from "@privy-io/react-auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import GlobalDialogs from "@/components/GlobalDialogs";
import { AgentProvider } from "@/contexts/AgentContext";

// Create a separate header component to use hooks
function Header() {
  const { isAuthenticated, login, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="flex justify-between items-center px-2 md:px-4 py-2">
        <Link
          href="/onboarding"
          className="text-lg md:text-xl font-bold"
          onClick={(e) => {
            e.preventDefault();
            router.push("/onboarding");
          }}
        >
          <div className="flex flex-row max-h-16 items-center space-x-0 text-black hover:text-purple-600 transition-colors">
            <AnimatedRobot scale={0.35} />
            <span className="inline">agentscan</span>
          </div>
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className={`flex items-center ${
              pathname === "/"
                ? "text-purple-600"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            Get Started
          </Link>

          <Link
            href="/agents"
            className={`flex items-center ${
              pathname === "/agents"
                ? "text-purple-600"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            Chat with Agents
          </Link>

          {isAuthenticated ? (
            <Button
              variant="ghost"
              onClick={logout}
              className="text-white hover:text-black bg-black transition-colors text-sm md:text-base h-auto flex items-center"
            >
              <span className="inline">Sign Out</span>
              <LogOut className="h-4 w-4 sm:ml-2" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                login();
              }}
              className="text-white hover:text-black bg-black transition-colors text-sm md:text-base h-auto flex items-center"
            >
              <span className="inline">Sign In</span>
              <LogIn className="h-4 w-4 sm:ml-2" />
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
  return (
    <AgentProvider>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          loginMethods: ["email", "wallet"],
          appearance: {
            theme: "light",
            accentColor: "#A855F7",
            showWalletLoginFirst: false,
          },
        }}
      >
        <div
          className={`${geistSansVariable} ${geistMonoVariable} min-h-screen flex flex-col`}
        >
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="w-full py-2 md:py-3 bg-muted/75 mt-auto fixed bottom-0">
            <div className="container mx-auto px-2 md:px-4 relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-black bg-purple-600 transition-colors text-sm md:text-base px-2 md:px-4"
                    onClick={() => {
                      window.open("https://t.me/ExploreSupport", "_blank");
                    }}
                  >
                    <span className="hidden sm:inline">Give</span> Feedback
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-xs md:text-sm text-muted-foreground text-center">
                    Copyright Explore Labs, Inc 2024 •{" "}
                    <Link
                      href="/disclaimer"
                      className="hover:text-purple-600 transition-colors"
                    >
                      Disclaimer & Privacy Policy
                    </Link>
                  </p>
                </div>

                <a
                  href="https://olas.network"
                  target="_blank"
                  className="flex items-center"
                >
                  <img src="/olas.svg" alt="Autonolas" className="h-6 md:h-9" />
                </a>
              </div>
            </div>
          </footer>
        </div>
        <GlobalDialogs />
      </PrivyProvider>
    </AgentProvider>
  );
}
