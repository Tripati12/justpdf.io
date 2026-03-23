"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import ActionButton from "@/components/actionbutton";
import SelectedFiles from "@/components/selectedfiles";
export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSplit = async () => {
    if (!file) return alert("Select a PDF first");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/pdf/split`,
      {
        method: "POST",
        body: formData,
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(".pdf", "_split.zip");
    a.click();

    setLoading(false);
  };

  return (
  <ToolLayout
    title="Split PDF"
    description="Split a PDF into individual pages (ZIP download)"
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
      label="Split PDF"
      loading={loading}
      onClick={handleSplit}
    />
  </ToolLayout>
);
}