"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function CompressPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCompress = async () => {
    if (files.length === 0) {
      alert("Select a PDF first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/pdf/compress`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Compression failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Compression failed");
    }

    setLoading(false);
  };

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while keeping quality"
    >
      <FileDropzone
        multiple={false}
        accept="application/pdf"
        onSelect={(fileList) => {
          if (!fileList || fileList.length === 0) return;
          setFiles([fileList[0]]);
        }}
      />

      {files.length > 0 && (
        <SelectedFiles
          files={files}
          onRemove={() => setFiles([])}
        />
      )}

      <ActionButton
        label="Compress PDF"
        loading={loading}
        onClick={handleCompress}
      />
    </ToolLayout>
  );
}
