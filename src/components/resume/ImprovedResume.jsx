import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumePDFExport from "@/components/resume/ResumePDFExport";

export default function ImprovedResume({ text, targetRole }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!text) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Improved Resume</h3>
        <div className="flex items-center gap-2">
          <ResumePDFExport text={text} targetRole={targetRole} />
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-xs">
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <div className="prose prose-sm max-w-none text-foreground/80 bg-secondary/30 rounded-xl p-4 max-h-[500px] overflow-y-auto">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
