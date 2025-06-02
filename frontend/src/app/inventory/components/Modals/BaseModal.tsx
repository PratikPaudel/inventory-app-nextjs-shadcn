import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BaseModalProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitText?: string;
  loadingText?: string;
}

// This component is a base modal that can be used for various forms.
// It includes a title, error message display, and a submit button.
export function BaseModal({
  title,
  children,
  isLoading = false,
  error = null,
  onClose,
  onSubmit,
  submitText = "Submit",
  loadingText = "Loading...",
}: BaseModalProps) {
  return (
    <DialogContent className="w-[85%] sm:w-[95%] max-w-2xl mx-auto dark:bg-gray-800 overflow-y-auto max-h-[92vh]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold dark:text-white">
          {title}
        </DialogTitle>
      </DialogHeader>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {children}

          <div className="flex justify-center sm:justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
            >
              {isLoading ? loadingText : submitText}
            </Button>
          </div>
      </form>
    </DialogContent>
  );
}