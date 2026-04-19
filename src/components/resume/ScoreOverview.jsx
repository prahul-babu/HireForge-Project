import React from "react";
import { motion } from "framer-motion";
import CircularProgress from "@/components/shared/CircularProgress";

function getScoreColor(score) {
  if (score >= 80) {
    return "hsl(160, 60%, 45%)";
  }
  if (score >= 60) {
    return "hsl(38, 92%, 50%)";
  }
  return "hsl(0, 84%, 60%)";
}

function getScoreLabel(score) {
  if (score >= 80) {
    return "Excellent";
  }
  if (score >= 60) {
    return "Good";
  }
  if (score >= 40) {
    return "Needs Work";
  }
  return "Poor";
}

export default function ScoreOverview({ analysis }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-6">Score Overview</h3>
      <div className="flex flex-wrap justify-center gap-8">
        <CircularProgress value={analysis.ats_score || 0} label="ATS Score" sublabel={getScoreLabel(analysis.ats_score)} color={getScoreColor(analysis.ats_score)} />
        <CircularProgress value={analysis.role_match_score || 0} label="Role Match" sublabel={getScoreLabel(analysis.role_match_score)} color={getScoreColor(analysis.role_match_score)} />
        <CircularProgress
          value={Math.round((((analysis.existing_skills?.length || 0) / Math.max((analysis.existing_skills?.length || 0) + (analysis.skills_gap?.length || 1), 1)) * 100))}
          label="Skills Coverage"
          sublabel={`${analysis.existing_skills?.length || 0} found`}
          color="hsl(var(--primary))"
        />
      </div>
    </motion.div>
  );
}
