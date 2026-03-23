"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return alert("Select at least one image");

    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/pdf/images-to-pdf`,
      {
        method: "POST",
        body: formData,
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "converted_images.pdf";
    a.click();

    setLoading(false);
  };

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert JPG, PNG images into a single PDF file"
    >
      <FileDropzone
        multiple
        accept="image/png,image/jpeg"
        onSelect={(files) => {
          if (!files) return;
          setFiles(Array.from(files));
        }}
      />

      {files.length > 0 && (
        <SelectedFiles
          files={files}
          onRemove={(index) =>
            setFiles(files.filter((_, i) => i !== index))
          }
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
