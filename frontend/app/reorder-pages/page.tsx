"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function ReorderPages() {
  const [file, setFile] = useState<File | null>(null);
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReorder = async () => {
    if (!file || !order) {
      setError("Select file and enter new page order.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", order);

      const res = await fetch(
        "http://127.0.0.1:8000/pdf/reorder-pages",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reordered.pdf";
      a.click();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Reorder PDF Pages"
      description="Enter full page order (e.g. 1,3,2,4)"
    >
      <FileDropzone
        accept=".pdf"
        onSelect={(files) => setFile(files?.[0] || null)}
      />

      {file && (
        <SelectedFiles
          files={[file]}
          onRemove={() => setFile(null)}
        />
      )}

      <input
        type="text"
        placeholder="New order (e.g. 1,3,2,4)"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        className="w-full p-3 mt-4 rounded bg-zinc-800"
      />

      {error && (
        <p className="text-red-500 mt-4 text-center">{error}</p>
      )}

      <ActionButton
        label={loading ? "Processing..." : "Reorder Pages"}
        onClick={handleReorder}
        disabled={loading}
      />
    </ToolLayout>
  );
}
