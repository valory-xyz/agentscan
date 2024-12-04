import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left side - Logo and Name */}
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Agentscan Logo" width={32} height={32} />
          <span className="text-xl font-semibold">agentscan</span>
        </div>

        {/* Right side - Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4"
          >
            Give Feedback
          </Button>
          
          <Button 
            variant="outline"
            className="border-2 border-black hover:bg-gray-100 text-black rounded-full px-4 flex items-center gap-2"
          >
            Sign In
            <LogIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}