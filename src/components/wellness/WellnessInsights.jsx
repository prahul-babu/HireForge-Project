import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Minus, TrendingDown, TrendingUp } from "lucide-react";

function getTrend(recent, older) {
  if (!recent.length || !older.length) {
    return "stable";
  }
  const avg = (arr, key) => arr.reduce((s, c) => s + (c[key] || 0), 0) / arr.length;
  const diff = avg(recent, "focus_score") - avg(older, "focus_score");
  if (diff > 0.5) {
    return "improving";
  }
  if (diff < -0.5) {
    return "declining";
  }
  return "stable";
}

export default function WellnessInsights({ checkIns = [] }) {
  if (checkIns.length < 3) {
    return null;
  }

  const recent = checkIns.slice(0, 7);
  const older = checkIns.slice(7, 14);
  const trend = getTrend(recent, older);
  const avgStress = (recent.reduce((s, c) => s + (c.stress_level || 0), 0) / recent.length).toFixed(1);
  const avgSleep = (recent.reduce((s, c) => s + (c.sleep_hours || 0), 0) / recent.length).toFixed(1);

  const insights = [];
  if (parseFloat(avgStress) > 7) {
    insights.push("Your stress levels are high. Try short breaks and breathing exercises.");
  }
  if (parseFloat(avgSleep) < 6.5) {
    insights.push("You are not getting enough sleep. Aim for 7 to 8 hours for better focus.");
  }
  if (trend === "improving") {
    insights.push("Great progress. Your focus has been improving this week.");
  }
  if (trend === "declining") {
    insights.push("Your focus seems to be declining. Try reducing distractions and batching tasks.");
  }
  if (!insights.length) {
    insights.push("You are doing well. Keep up the routine for steady performance.");
  }

  const TrendIcon = trend === "improving" ? TrendingUp : trend === "declining" ? TrendingDown : Minus;
  const trendColor = trend === "improving" ? "text-green-500" : trend === "declining" ? "text-red-500" : "text-muted-foreground";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Weekly Insights</h3>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {trend === "improving" ? "Improving" : trend === "declining" ? "Declining" : "Stable"}
        </div>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-xl bg-secondary/50">
            <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80">{insight}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
