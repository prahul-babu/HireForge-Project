import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function ScoreDot({ cx, cy }) {
  return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth={2} />;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }
  const ats = payload.find((p) => p.dataKey === "ats");
  const match = payload.find((p) => p.dataKey === "match");
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-xs space-y-1.5 min-w-[130px]">
      <p className="text-muted-foreground font-medium">{label}</p>
      {ats && (
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">ATS</span>
          <span className="font-semibold text-primary">{ats.value}</span>
        </div>
      )}
      {match && (
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Role Match</span>
          <span className="font-semibold" style={{ color: "hsl(160,60%,45%)" }}>
            {match.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default function ATSProgressWidget({ analyses }) {
  const sorted = [...analyses].reverse();
  const chartData = sorted.map((a, i) => ({
    label: analyses.length > 1 ? format(new Date(a.created_date), "MMM d") : `v${i + 1}`,
    ats: a.ats_score || 0,
    match: a.role_match_score || 0
  }));
  const latest = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  const atsDelta = prev ? (latest?.ats_score || 0) - (prev?.ats_score || 0) : null;
  const TrendIcon = atsDelta > 0 ? TrendingUp : atsDelta < 0 ? TrendingDown : Minus;
  const trendColor = atsDelta > 0 ? "text-green-500" : atsDelta < 0 ? "text-red-500" : "text-muted-foreground";
  const bestATS = Math.max(...analyses.map((a) => a.ats_score || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-card rounded-2xl border border-border p-6 lg:col-span-2"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold">ATS Score Progress</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Track improvement across resume iterations</p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-xs text-muted-foreground">Latest ATS</p>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xl font-bold">{latest?.ats_score ?? "—"}</span>
              {atsDelta !== null && (
                <span className={`flex items-center text-xs font-medium ${trendColor}`}>
                  <TrendIcon className="w-3 h-3 mr-0.5" />
                  {atsDelta > 0 ? "+" : ""}
                  {atsDelta}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Best Ever</p>
            <span className="text-xl font-bold">{bestATS || "—"}</span>
          </div>
        </div>
      </div>

      {chartData.length > 1 ? (
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={80}
                stroke="hsl(var(--border))"
                strokeDasharray="6 3"
                label={{ value: "ATS target", position: "right", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <Line type="monotone" dataKey="ats" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={<ScoreDot />} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="match" stroke="hsl(160,60%,45%)" strokeWidth={2} dot={false} activeDot={{ r: 5 }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[200px] flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-accent-foreground" />
          </div>
          <p className="text-sm font-medium">Only one analysis so far</p>
          <p className="text-xs text-muted-foreground mt-1">Submit another resume iteration to see your progress trend</p>
        </div>
      )}
    </motion.div>
  );
}
