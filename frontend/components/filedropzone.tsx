"use client";

import { useRef } from "react";

export default function FileDropzone({
  onFilesSelected,
}: {
  onFilesSelected?: (files: FileList) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFilesSelected) {
      onFilesSelected(e.target.files);

      // 🔥 FIX: allow selecting same file again
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files && onFilesSelected) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <p className="text-gray-700 font-medium">
        Drag & drop files here
      </p>
      <p className="text-sm text-gray-400 mt-1">
        or click to select files
      </p>
    </div>
  );
}