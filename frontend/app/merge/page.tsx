"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return alert("Select at least 2 PDFs");

    setLoading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/pdf/merge`,
      { method: "POST", body: formData }
    );

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);

    setLoading(false);
  };

  return (
    <ToolLayout
      title="Merge PDFs"
      description="Combine multiple PDFs into one file"
    >
      <FileDropzone
        multiple
        accept="application/pdf"
        onSelect={(f) => f && setFiles([...files, ...Array.from(f)])}
      />

      {files.length > 0 && (
        <SelectedFiles
          files={files}
          onRemove={(i) =>
            setFiles(files.filter((_, idx) => idx !== i))
          }
        />
      )}

      <ActionButton
        label="Merge PDF"
        loading={loading}
        disabled={files.length < 2}
        onClick={handleMerge}
      />
    </ToolLayout>
  );
}
