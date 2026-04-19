import React from "react";
import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, subtitle, trend, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={`bg-card rounded-2xl border border-border p-5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-xl bg-accent">
          <Icon className="w-4 h-4 text-accent-foreground" />
        </div>
        {trend ? (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        ) : null}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
