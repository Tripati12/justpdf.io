"use client"

import { useState } from "react"
import ToolLayout from "@/components/toollayout"
import FileDropzone from "@/components/filedropzone"
import ActionButton from "@/components/actionbutton"
import SelectedFiles from "@/components/selectedfiles"

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleConvert = async () => {
    if (!file) return alert("Select a PDF first")

    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/pdf/pdf-to-jpg`,
      {
        method: "POST",
        body: formData,
      }
    )

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "images.zip"
    a.click()

    setLoading(false)
  }

  return (
    <ToolLayout
      title="PDF to JPG"
      description="Convert each PDF page into high-quality JPG images"
    >
      <FileDropzone
        accept="application/pdf"
        onSelect={(files) => {
          if (files && files.length > 0) {
            setFile(files[0])
          }
        }}
      />

      {file && (
        <SelectedFiles
          files={[file]}
          onRemove={() => setFile(null)}
        />
      )}

      <ActionButton
        label="Convert to JPG"
        loading={loading}
        onClick={handleConvert}
      />
    </ToolLayout>
  )
}
