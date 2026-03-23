"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function ExtractPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!file || !pages) {
      setError("Select file and enter pages to extract.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", pages);

      const res = await fetch(
        "http://127.0.0.1:8000/pdf/extract-pages",
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
      a.download = "extracted.pdf";
      a.click();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Extract PDF Pages"
      description="Extract selected pages (e.g. 1-3,5)"
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
        placeholder="Pages to extract (e.g. 1-3,5)"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        className="w-full p-3 mt-4 rounded bg-zinc-800"
      />

      {error && (
        <p className="text-red-500 mt-4 text-center">{error}</p>
      )}

      <ActionButton
        label={loading ? "Processing..." : "Extract Pages"}
        onClick={handleExtract}
        disabled={loading}
      />
    </ToolLayout>
  );
}
