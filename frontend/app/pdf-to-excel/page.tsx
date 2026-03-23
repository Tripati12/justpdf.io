"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function PdfToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!file) return alert("Select a PDF first");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/pdf/pdf-to-excel`,
      {
        method: "POST",
        body: formData,
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    // dynamic file name
    const originalName = file.name.replace(".pdf", "");
    a.download = `${originalName}.xlsx`;

    a.click();

    setLoading(false);
  };

  return (
    <ToolLayout
      title="PDF to Excel"
      description="Convert PDF tables into editable Excel sheets"
    >
      <FileDropzone
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
        label="Convert to Excel"
        loading={loading}
        onClick={handleConvert}
      />
    </ToolLayout>
  );
}
