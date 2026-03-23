"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    if (!file || !password) {
      setError("Please select a file and enter the password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/pdf/unlock`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Wrong password or failed to unlock PDF.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "unlocked.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove password protection from your PDF file"
    >
      <FileDropzone
        accept=".pdf"
        onSelect={(files) => {
          if (files && files.length > 0) {
            setFile(files[0]);
            setError(null);
          }
        }}
      />

      {file && (
        <SelectedFiles
          files={[file]}
          onRemove={() => {
            setFile(null);
            setError(null);
          }}
        />
      )}

      {/* Password Field */}
      <div className="relative mt-4">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-3 text-sm text-center">{error}</p>
      )}

      <div className="mt-4">
        <ActionButton
          label={loading ? "Processing..." : "Unlock PDF"}
          onClick={handleUnlock}
          loading={loading}
        />
      </div>
    </ToolLayout>
  );
}
