"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function DeletePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!file || !pages) {
      setError("Select file and enter pages to delete.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", pages);

      const res = await fetch(
        "http://127.0.0.1:8000/pdf/delete-pages",
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
      a.download = "deleted_pages.pdf";
      a.click();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Delete PDF Pages"
      description="Remove specific pages (e.g. 2,4-6)"
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
        placeholder="Pages to delete (e.g. 2,4-6)"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        className="w-full p-3 mt-4 rounded bg-zinc-800"
      />

      {error && (
        <p className="text-red-500 mt-4 text-center">{error}</p>
      )}

      <ActionButton
        label={loading ? "Processing..." : "Delete Pages"}
        onClick={handleDelete}
        disabled={loading}
      />
    </ToolLayout>
  );
}
