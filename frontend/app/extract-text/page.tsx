"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function ExtractText() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!file) return alert("Select a PDF first");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/pdf/extract-text`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      setLoading(false);
      return alert("Text extraction failed");
    }

    // 🔥 Important: download file
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(".pdf", ".txt");
    a.click();

    setLoading(false);
  };

  return (
    <ToolLayout
      title="Extract Text from PDF"
      description="Extract all readable text from your PDF document"
    >
      <FileDropzone
        multiple={false}
        accept="application/pdf"
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
        label="Extract Text"
        loading={loading}
        onClick={handleExtract}
      />
    </ToolLayout>
  );
}
