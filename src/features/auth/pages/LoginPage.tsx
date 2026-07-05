import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/lgu-sibagat-2.png')",
        }}
      />

      {/* Green Overlay */}
      <div className="absolute inset-0 bg-emerald-950/25 backdrop-blur-[3px]" />

      {/* Decorative Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-900/40 via-transparent to-emerald-700/30" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <LoginForm />
      </div>
    </main>
  );
}
