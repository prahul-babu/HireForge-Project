import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SkillsAnalysis({ existing = [], missing = [] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Skills Analysis</h3>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Check className="w-3 h-3 text-green-500" /> Skills Found ({existing.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {existing.map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal bg-green-500/10 text-green-500 border-0">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <X className="w-3 h-3 text-red-500" /> Missing Skills ({missing.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal bg-red-500/10 text-red-500 border-0">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
