import { useAuth } from "@/hooks/use-auth";
import ExternalLinkDialog from "./ExternalLinkDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useAgent } from "@/contexts/AgentContext";

export default function GlobalDialogs() {
  const { externalUrl, showAuthDialog, setExternalUrl, setShowAuthDialog } =
    useAgent();
  const { login } = useAuth();

  const cleanUrl = (url: string) => url.replace(/\/+$/, "");

  return (
    <>
      <ExternalLinkDialog
        url={externalUrl}
        onClose={() => setExternalUrl(null)}
        onConfirm={(url) => {
          window.open(cleanUrl(url), "_blank");
          setExternalUrl(null);
        }}
      />
      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please sign in to continue using agentscan. Signing in helps us
              provide a better experience and prevent abuse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                login();
                setShowAuthDialog(false);
              }}
            >
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
