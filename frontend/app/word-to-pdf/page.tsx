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
    if (!file) return alert("Select a Word file first");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/pdf/word-to-pdf`,
      {
        method: "POST",
        body: formData,
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const originalName = file.name.replace(".docx", "").replace(".doc", "");
    a.download = `${originalName}.pdf`;

    a.click();

    setLoading(false);
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
        label="Convert to PDF"
        loading={loading}
        onClick={handleConvert}
      />
    </ToolLayout>
  );
}
