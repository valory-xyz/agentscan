import React, { createContext, useContext, useState } from "react";

interface AgentContextType {
  externalUrl: string | null;
  setExternalUrl: (url: string | null) => void;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <AgentContext.Provider
      value={{ externalUrl, setExternalUrl, showAuthDialog, setShowAuthDialog }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};
