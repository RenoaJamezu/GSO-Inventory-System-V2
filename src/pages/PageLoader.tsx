import { LoadingState } from "@/components/ui";

type PageLoaderProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function PageLoader({
  message = "Loading workspace...",
  fullScreen = false,
}: PageLoaderProps) {
  return <LoadingState message={message} fullScreen={fullScreen} />;
}
