"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function ProtectPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Password Strength Logic
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score === 2) return { label: "Fair", color: "bg-yellow-500", width: "50%" };
    if (score === 3) return { label: "Good", color: "bg-blue-500", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getStrength();

  const handleProtect = async () => {
    if (!file || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/pdf/protect`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to protect PDF.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "protected.pdf";
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
      title="Protect PDF"
      description="Add a password to secure your PDF document"
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
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>

      {/* Strength Meter */}
      {password && (
        <div className="mt-2">
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-500`}
              style={{ width: strength.width }}
            />
          </div>
          <p className="text-sm mt-1 text-gray-300">
            Strength: <span className="font-semibold">{strength.label}</span>
          </p>
        </div>
      )}

      {/* Confirm Password */}
      <div className="relative mt-4">
        <input
          type={showConfirm ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />

        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
        >
          {showConfirm ? "🙈" : "👁"}
        </button>
      </div>

      {/* Match indicator */}
      {confirmPassword && (
        <p
          className={`text-sm mt-1 ${
            password === confirmPassword ? "text-green-400" : "text-red-400"
          }`}
        >
          {password === confirmPassword
            ? "Passwords match"
            : "Passwords do not match"}
        </p>
      )}

      {error && (
        <p className="text-red-500 mt-3 text-sm text-center animate-pulse">
          {error}
        </p>
      )}

      <div className="mt-5">
        <ActionButton
          label={loading ? "Processing..." : "Protect PDF"}
          onClick={handleProtect}
          loading={loading}
        />
      </div>
    </ToolLayout>
  );
}
