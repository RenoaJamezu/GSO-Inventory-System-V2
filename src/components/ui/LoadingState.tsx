import { LoaderCircle } from "lucide-react";

type LoadingStateProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function LoadingState({
  message = "Loading...",
  fullScreen = false,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex items-center justify-center",
        fullScreen
          ? "min-h-screen bg-slate-50 dark:bg-slate-950"
          : "min-h-70",
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <LoaderCircle
          size={24}
          strokeWidth={2}
          className="animate-spin text-emerald-700 dark:text-emerald-400"
          aria-hidden="true"
        />

        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}
