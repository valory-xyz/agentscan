"use client";

import Onboarding from "@/components/Onboarding";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const handleStartChat = () => {
    router.push("/agents"); // or wherever you want to redirect for chat
  };

  return (
    <Onboarding onStartChat={handleStartChat} />
  );
} 