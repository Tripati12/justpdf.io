"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function ExcelToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!files || files.length === 0) {
      alert("Select an Excel file first");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    // IMPORTANT: backend expects "file"
    formData.append("file", files[0]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/pdf/excel-to-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Excel to PDF failed");
    }

    setLoading(false);
  };

  return (
    <ToolLayout
      title="Excel to PDF"
      description="Convert XLS or XLSX spreadsheets into PDF format"
    >
      <FileDropzone
        multiple={false}
        accept=".xls,.xlsx"
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
        label="Convert to PDF"
        loading={loading}
        onClick={handleConvert}
      />
    </ToolLayout>
  );
}
