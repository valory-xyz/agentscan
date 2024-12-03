import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExternalLinkDialogProps {
  url: string | null;
  onClose: () => void;
  onConfirm: (url: string) => void;
}

const ExternalLinkDialog: React.FC<ExternalLinkDialogProps> = ({
  url,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={!!url}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leaving Agentscan</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to leave Agentscan to visit an external website.
            Please note that we cannot guarantee the safety or reliability of
            external sites. Use any external software at your own risk.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => url && onConfirm(url)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExternalLinkDialog;
