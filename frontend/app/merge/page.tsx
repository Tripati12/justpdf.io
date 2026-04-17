"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (fileList: FileList) => {
  const newFiles = Array.from(fileList); // convert FileList → File[]
  setFiles((prev) => [...prev, ...newFiles]);
};

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length === 0) {
      alert("Please select files first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("http://localhost:8000/merge", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Merge failed");

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ RETURN MUST BE INSIDE FUNCTION
  return (
    <ToolLayout
      title="Merge PDFs"
      description="Combine multiple PDFs into one file"
    >
      <FileDropzone onFilesSelected={handleFiles} />

      <SelectedFiles files={files} onRemove={removeFile} />

      <ActionButton
        label="Merge PDF"
        loading={loading}
        onClick={handleMerge}
      />

      <p className="text-sm text-gray-500 text-center mt-4">
        Files are processed securely and deleted automatically
      </p>
    </ToolLayout>
  );
}