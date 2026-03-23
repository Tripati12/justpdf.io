"use client";

import { useState } from "react";
import ToolLayout from "@/components/toollayout";
import FileDropzone from "@/components/filedropzone";
import SelectedFiles from "@/components/selectedfiles";
import ActionButton from "@/components/actionbutton";

export default function WatermarkPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(40);
  const [rotation, setRotation] = useState(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWatermark = async () => {
    if (!file || !text) {
      setError("Please select file and enter watermark text.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    formData.append("opacity", opacity.toString());
    formData.append("font_size", fontSize.toString());
    formData.append("rotation", rotation.toString());

    try {
      const res = await fetch("http://127.0.0.1:8000/pdf/watermark", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Watermark failed.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "watermarked.pdf";
      a.click();
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Add Watermark"
      description="Add custom text watermark to your PDF"
    >
      <FileDropzone
        accept=".pdf"
        onSelect={(files) => setFile(files?.[0] ?? null)}
      />

      {file && (
        <SelectedFiles
          files={[file]}
          onRemove={() => setFile(null)}
        />
      )}

      <input
        type="text"
        placeholder="Enter watermark text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full mt-4 p-3 rounded-lg bg-neutral-800 border border-neutral-700"
      />

      <div className="mt-4">
        <label>Opacity: {opacity}</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mt-4">
        <label>Font Size: {fontSize}</label>
        <input
          type="range"
          min="20"
          max="100"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mt-4">
        <label>Rotation: {rotation}°</label>
        <input
          type="range"
          min="0"
          max="90"
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {error && (
        <p className="text-red-500 mt-3 text-center">{error}</p>
      )}

      <ActionButton
        label={loading ? "Processing..." : "Add Watermark"}
        onClick={handleWatermark}
      />
    </ToolLayout>
  );
}
