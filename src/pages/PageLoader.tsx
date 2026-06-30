export default function PageLoader({ message = "Loading workspace..." }: { message?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50">
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
