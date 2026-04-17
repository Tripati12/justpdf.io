"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

const handleConvert = async () => {
  if (!file) {
    alert("Select a Word file first");
    return;
  }

  try {
    setLoading(true);
    console.time("convert");

    const formData = new FormData();
    formData.append("file", file);

    const API = process.env.NEXT_PUBLIC_API_BASE;

    const res = await fetch(`${API}/pdf/word-to-pdf`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);
      throw new Error("Server error");
    }

    const blob = await res.blob();

    console.log("Blob size:", blob.size);

    if (blob.size === 0) {
      throw new Error("Empty PDF received");
    }

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const originalName = file.name
      .replace(".docx", "")
      .replace(".doc", "");

    a.download = `${originalName}.pdf`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Conversion error:", err);
    alert("Failed to convert file. Check backend.");
  } finally {
    setLoading(false);
    console.timeEnd("convert");
  }
};

  return (
    <ToolLayout
      title="Word to PDF"
      description="Convert Word documents into high-quality PDF files"
    >
      <FileDropzone
        accept=".doc,.docx"
        onSelect={(files) => {
          if (!files || files.length === 0) return;
          setFile(files[0]);
        }}
      />

      {file && (
        <SelectedFiles
          files={[file]}
          onRemove={() => setFile(null)}
        />
      )}

      <ActionButton
        label={loading ? "Converting..." : "Convert to PDF"}
        loading={loading}
        onClick={handleConvert}
      />
    </ToolLayout>
  );
}