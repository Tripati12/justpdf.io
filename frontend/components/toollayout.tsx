"use client";

export default function ToolLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1120] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-2">
          {title}
        </h1>

        <p className="text-gray-400 text-center mb-6">
          {description}
        </p>

        {children}

        <p className="text-xs text-gray-500 text-center mt-6">
          Files are processed securely and deleted automatically
        </p>
      </div>
    </main>
  );
}
