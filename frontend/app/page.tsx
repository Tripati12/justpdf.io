"use client";

import { useState } from "react";
import {
  Merge,
  Scissors,
  FileText,
  FileDown,
  FileUp,
  Image,
  Shield,
  Search,
  Zap,
} from "lucide-react";

const tools = [
  {
    name: "Merge PDF",
    desc: "Combine multiple PDFs into one file",
    icon: Merge,
    href: "/merge",
  },
  {
    name: "Split PDF",
    desc: "Split PDF into individual pages",
    icon: Scissors,
    href: "/split",
  },
  {
    name: "PDF to Word",
    desc: "Convert PDF into editable Word",
    icon: FileDown,
    href: "/pdf-to-word",
  },
  {
    name: "Word to PDF",
    desc: "Convert DOCX to PDF",
    icon: FileUp,
    href: "/word-to-pdf",
  },
  {
    name: "PDF to Excel",
    desc: "Extract tables into Excel",
    icon: FileText,
    href: "/pdf-to-excel",
  },
  {
    name: "Image to PDF",
    desc: "Convert images into PDF",
    icon: Image,
    href: "/image-to-pdf",
  },
  {
    name: "Compress PDF",
    desc: "Reduce PDF file size",
    icon: Zap,
    href: "/compress",
  },
  {
    name: "Protect PDF",
    desc: "Add password protection",
    icon: Shield,
    href: "/protect",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-6 py-10">
      
      {/* HERO */}
      <section className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Powerful PDF Tools
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Simple. Fast. Secure. Edit, convert and manage your PDFs instantly.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
            Start Converting
          </button>
          <button className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
            Explore Tools
          </button>
        </div>
      </section>

      {/* SEARCH */}
      <div className="max-w-xl mx-auto mb-10 relative">
        <Search className="absolute left-4 top-4 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* TOOLS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {filteredTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <a
              key={index}
              href={tool.href}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Icon className="text-blue-600" size={20} />
                </div>
                <h3 className="font-semibold text-lg">{tool.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{tool.desc}</p>
            </a>
          );
        })}
      </section>

      {/* FOOTER */}
      <footer className="text-center mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} JustPDF. All rights reserved.
      </footer>
    </main>
  );
}