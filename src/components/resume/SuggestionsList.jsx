import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const priorityConfig = {
  high: { icon: AlertCircle, color: "bg-red-500/10 text-red-500" },
  medium: { icon: AlertTriangle, color: "bg-yellow-500/10 text-yellow-500" },
  low: { icon: Info, color: "bg-blue-500/10 text-blue-500" }
};

export default function SuggestionsList({ suggestions = [] }) {
  const sorted = [...suggestions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] || 2) - (order[b.priority] || 2);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Suggested Improvements ({suggestions.length})</h3>
      <div className="space-y-3">
        {sorted.map((item, i) => {
          const config = priorityConfig[item.priority] || priorityConfig.low;
          const Icon = config.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} className="flex gap-3 p-3 rounded-xl bg-secondary/50">
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color.split(" ")[1]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {item.category?.replace(/_/g, " ")}
                  </Badge>
                  <Badge className={`text-[10px] border-0 ${config.color}`}>{item.priority}</Badge>
                </div>
                <p className="text-sm text-foreground/80">{item.suggestion}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
