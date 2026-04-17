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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        <p className="text-gray-500 mt-2">{description}</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        {children}
      </div>

    </div>
  );
}