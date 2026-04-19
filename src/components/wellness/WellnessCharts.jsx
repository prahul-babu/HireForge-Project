import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function WellnessCharts({ checkIns = [] }) {
  const chartData = checkIns
    .slice()
    .reverse()
    .slice(-14)
    .map((c) => ({
      date: format(new Date(c.date), "MMM d"),
      stress: c.stress_level,
      focus: c.focus_score,
      sleep: c.sleep_hours
    }));

  const tooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "12px",
    fontSize: 11
  };

  if (chartData.length < 2) {
    return null;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Stress & Focus Trends</h3>
        <div className="h-[200px]">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="stress" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="focus" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Sleep Tracking</h3>
        <div className="h-[180px]">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 12]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="sleep" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
