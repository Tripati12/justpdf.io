"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const tools = [
  { title: "Merge PDF", desc: "Combine multiple PDFs into one file", href: "/merge",category: "edit"  },
  { title: "Split PDF", desc: "Split PDF into individual pages", href: "/split",category: "edit"  },
  { title: "PDF to Excel", desc: "Extract tables from PDF to Excel", href: "/pdf-to-excel",category: "convert" },
  { title: "PDF to Word", desc: "Convert PDF into editable Word", href: "/pdf-to-word",category: "convert" },
  { title: "Word to PDF", desc: "Convert DOCX to PDF format", href: "/word-to-pdf",category: "convert" },
  { title: "Excel to PDF", desc: "Convert XLSX spreadsheets to PDF", href: "/excel-to-pdf",category: "convert" },
  { title: "Compress PDF", desc: "Reduce PDF file size", href: "/compress",category: "optimize" },
  { title: "Auto Compress", desc: "Smart compression with AI optimization", href: "/compress-auto",category: "optimize" },
  { title: "Extract Text", desc: "Extract readable text from PDF", href: "/extract-text",category: "edit"  },
  { title: "Image to PDF", desc: "Convert images into a single PDF file", href: "/image-to-pdf",category: "convert" },
  {title: "PDF to JPG",desc: "Convert PDF pages into JPG images",href: "/pdf-to-jpg",category: "convert"},
  {title: "Protect PDF",desc: "Add password protection to PDF",href: "/protect", category: "security" },
  {title: "Unlock PDF",desc: "Remove password protection from PDF",href: "/unlock", category: "security" },
  { title: "JPG to PDF", desc: "Convert images to PDF", href: "/jpg-to-pdf",category: "convert" },
  {title: "Add Watermark",desc: "Add custom text watermark to PDF",href: "/watermark",category: "edit" },
   { title: "Delete Pages", desc: "Remove specific pages", href: "/delete-pages",category: "edit"  },
   { title: "Reorder Pages", desc: "Change page order", href: "/reorder-pages",category: "edit"  },
   { title: "Extract Pages", desc: "Extract selected pages", href: "/extract-pages",category: "edit"  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filter === "all" || tool.category === filter;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="text-center py-24 px-6 bg-gradient-to-b from-black via-zinc-900 to-black">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Powerful PDF Tools <br />
          <span className="text-blue-500">Simple. Fast. Secure.</span>
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
          Edit, convert, protect and manage your PDF files instantly.
          No installation. No sign-up required.
        </p>

        <div className="flex justify-center gap-4">
          {/* FIXED: Scroll to tools instead of redirect */}
          <a
            href="#tools"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
          >
            Start Converting
          </a>

          <a
            href="#tools"
            className="px-6 py-3 border border-gray-600 hover:border-white rounded-xl transition"
          >
            Explore Tools
          </a>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <section id="tools" className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex justify-center mb-8">
  <div className="relative w-full max-w-2xl">
    <input
      type="text"
      placeholder="Search tools..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="
        w-full px-6 py-4 pl-12
        bg-zinc-900/60
        border border-zinc-700
        rounded-2xl
        text-white
        placeholder-zinc-500
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        transition-all duration-300
        backdrop-blur-md
      "
    />

    {/* Search Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
</div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
  {[
    { label: "All", value: "all" },
    { label: "Edit", value: "edit" },
    { label: "Convert", value: "convert" },
    { label: "Security", value: "security" },
    { label: "Optimize", value: "optimize" },
  ].map((item) => (
    <button
      key={item.value}
      onClick={() => setFilter(item.value)}
      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
        ${
          filter === item.value
            ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-black shadow-lg scale-105"
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        }`}
    >
      {item.label}
    </button>
  ))}
</div>


        {/* TOOLS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className="p-6 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition border border-zinc-800 hover:border-blue-500"
            >
              <h3 className="text-xl font-semibold mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-400">
                {tool.desc}
              </p>

              <span className="text-xs mt-3 inline-block text-blue-400 capitalize">
                {tool.category}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="text-center py-16 border-t border-zinc-800">
        <h2 className="text-2xl font-semibold mb-6">
          Trusted PDF Processing
        </h2>

        <div className="flex justify-center gap-10 text-gray-400">
          <div>
            <p className="text-3xl font-bold text-white">Fast</p>
            <p>Instant processing</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">Secure</p>
            <p>Files auto-deleted</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">Free</p>
            <p>No hidden cost</p>
          </div>
        </div>
      </section>

    </main>
  );
}