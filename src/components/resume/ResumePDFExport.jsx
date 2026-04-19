import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, Loader2, X } from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

const TEMPLATES = [
  { id: "modern", name: "Modern", description: "Two-column with colored sidebar" },
  { id: "clean", name: "Clean", description: "Single-column, ATS-safe" },
  { id: "classic", name: "Classic", description: "Traditional centered header" }
];

function parseResume(text) {
  if (!text) {
    return { name: "", contacts: [], sections: [] };
  }
  const lines = text.split("\n");
  let name = "";
  const contacts = [];
  const sections = [];
  let currentSection = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }
    if (line.startsWith("# ")) {
      name = line.replace(/^#+\s*/, "").replace(/\*\*/g, "");
    } else if (line.startsWith("## ")) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { title: line.replace(/^#+\s*/, ""), items: [] };
    } else if (line.startsWith("### ")) {
      currentSection?.items.push({ type: "subheading", text: line.replace(/^#+\s*/, "").replace(/\*\*/g, "") });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      currentSection?.items.push({ type: "bullet", text: line.replace(/^[-*]\s*/, "").replace(/\*\*/g, "") });
    } else if (/^\*\*[^*]+\*\*/.test(line)) {
      currentSection?.items.push({ type: "bold", text: line.replace(/\*\*/g, "") });
    } else if (currentSection) {
      currentSection.items.push({ type: "text", text: line.replace(/\*\*/g, "") });
    } else if (!name) {
      contacts.push(line.replace(/\*\*/g, ""));
    } else {
      contacts.push(line.replace(/\*\*/g, ""));
    }
  }
  if (currentSection) {
    sections.push(currentSection);
  }
  return { name, contacts, sections };
}

function generateClean(doc, data) {
  const pageW = 210;
  const mx = 18;
  const contentW = pageW - mx * 2;
  let y = 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(data.name || "Your Name", mx, y);
  y += 8;
  if (data.contacts.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const contactLine = data.contacts.slice(0, 4).join("  ·  ");
    const wrapped = doc.splitTextToSize(contactLine, contentW);
    for (const l of wrapped) {
      doc.text(l, mx, y);
      y += 4.5;
    }
    y += 2;
  }
  doc.rect(mx, y, contentW, 1.2, "F");
  y += 5;
  for (const sec of data.sections) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(sec.title.toUpperCase(), mx, y);
    y += 6;
    for (const item of sec.items) {
      doc.setFont("helvetica", item.type === "subheading" || item.type === "bold" ? "bold" : "normal");
      doc.setFontSize(9);
      const text = item.type === "bullet" ? `• ${item.text}` : item.text;
      const wrapped = doc.splitTextToSize(text, contentW);
      for (const line of wrapped) {
        doc.text(line, mx, y);
        y += 5;
      }
    }
    y += 4;
  }
}

export default function ResumePDFExport({ text, targetRole }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("clean");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    setGenerating(true);
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const data = parseResume(text);
    generateClean(doc, data, selected);
    const filename = `${(targetRole || "resume").replace(/[^a-z0-9]/gi, "_").toLowerCase()}_hireforge.pdf`;
    doc.save(filename);
    setGenerating(false);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="h-8 text-xs gap-1.5">
        <Download className="w-3 h-3" /> Export PDF
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-semibold">Export as PDF</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Professionally formatted resume</p>
                  </div>
                  <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-2.5 mb-6">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelected(t.id)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${
                        selected === t.id ? "border-primary bg-accent" : "border-border hover:bg-secondary"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.description}</p>
                      </div>
                      {selected === t.id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 rounded-xl">
                    Cancel
                  </Button>
                  <Button onClick={handleExport} disabled={generating} className="flex-1 rounded-xl">
                    {generating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Generating...
                      </>
                    ) : done ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Downloaded
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
