"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function AutoCompressPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAutoCompress = async () => {
    if (files.length === 0) {
      alert("Select a PDF first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/pdf/compress-auto`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Auto compression failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "auto-compressed.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Auto compression failed");
    }

    setLoading(false);
  };

  return (
    <ToolLayout
      title="Auto Compress PDF"
      description="Automatically optimize PDF for best size-quality balance"
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
        label="Auto Compress"
        loading={loading}
        onClick={handleAutoCompress}
      />
    </ToolLayout>
  );
}
