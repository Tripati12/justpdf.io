"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function JPGToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState("A4");
  const [margin, setMargin] = useState(20);
  const [orientation, setOrientation] = useState("portrait");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!files.length) return;

    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("page_size", pageSize);
    formData.append("margin", String(margin));
    formData.append("orientation", orientation);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/pdf/jpg-to-pdf`,
      {
        method: "POST",
        body: formData,
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.pdf";
    a.click();

    setLoading(false);
  };

  return (
    <ToolLayout
      title="JPG to PDF"
      description="Convert JPG images into a professional PDF document"
    >
      <FileDropzone
        multiple
        accept=".jpg,.jpeg,.png"
        onSelect={(f) => setFiles(f ? Array.from(f) : [])}

      />

      {files.length > 0 && (
        <SelectedFiles
          files={files}
          onRemove={(i) =>
            setFiles(files.filter((_, index) => index !== i))
          }
        />
      )}

      <div className="mt-4 space-y-3">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="A4">A4</option>
          <option value="LETTER">Letter</option>
        </select>

        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>

        <input
          type="number"
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Margin"
        />
      </div>

      <ActionButton
        label={loading ? "Processing..." : "Convert to PDF"}
        onClick={handleConvert}
        disabled={loading}
      />
    </ToolLayout>
  );
}
