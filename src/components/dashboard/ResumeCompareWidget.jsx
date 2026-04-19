import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ChevronRight, GitCompare, Minus } from "lucide-react";

function DeltaBadge({ delta }) {
  if (delta === null || delta === undefined) {
    return null;
  }
  const positive = delta > 0;
  const neutral = delta === 0;
  const Icon = positive ? ArrowUpRight : neutral ? Minus : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
        positive
          ? "bg-green-500/10 text-green-600"
          : neutral
            ? "bg-secondary text-muted-foreground"
            : "bg-red-500/10 text-red-500"
      }`}
    >
      <Icon className="w-3 h-3" />
      {positive ? "+" : ""}
      {delta}
    </span>
  );
}

function ScoreRow({ label, original, latest }) {
  const delta = original !== undefined && latest !== undefined ? latest - original : null;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
        <div className="flex h-full">
          <div className="h-full rounded-full bg-border transition-all" style={{ width: `${original || 0}%` }} />
        </div>
      </div>
      <span className="text-xs font-medium w-6 text-right text-muted-foreground">{original ?? "—"}</span>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${latest || 0}%` }} />
      </div>
      <span className="text-xs font-medium w-6 text-right">{latest ?? "—"}</span>
      <div className="w-12 flex justify-end">
        <DeltaBadge delta={delta} />
      </div>
    </div>
  );
}

export default function ResumeCompareWidget({ analyses }) {
  const [showText, setShowText] = useState(false);
  if (!analyses || analyses.length === 0) {
    return null;
  }

  const sorted = [...analyses].reverse();
  const original = sorted[0];
  const latest = sorted[sorted.length - 1];
  const isSame = original.id === latest.id;
  const originalSkills = new Set(original.existing_skills || []);
  const latestSkills = new Set(latest.existing_skills || []);
  const newSkills = [...latestSkills].filter((s) => !originalSkills.has(s));
  const skillDelta = latestSkills.size - originalSkills.size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl border border-border p-6 lg:col-span-3"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <GitCompare className="w-3.5 h-3.5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Resume Progress Comparison</h3>
            <p className="text-xs text-muted-foreground">
              {isSame ? "Submit another iteration to compare" : `v1 (original) vs v${analyses.length} (latest)`}
            </p>
          </div>
        </div>
        {!isSame && (latest.improved_resume || original.resume_text) && (
          <button onClick={() => setShowText(!showText)} className="text-xs text-primary hover:underline font-medium">
            {showText ? "Hide text diff" : "View text comparison"}
          </button>
        )}
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-3 pb-1.5 mb-1">
          <span className="text-xs text-muted-foreground w-24 shrink-0" />
          <span className="flex-1 text-xs text-muted-foreground text-center">Original</span>
          <span className="w-6" />
          <ChevronRight className="w-3.5 h-3.5 text-transparent shrink-0" />
          <span className="flex-1 text-xs text-primary font-medium text-center">Latest</span>
          <span className="w-6" />
          <span className="w-12 text-right text-xs text-muted-foreground">D</span>
        </div>
        <ScoreRow label="ATS Score" original={original.ats_score} latest={latest.ats_score} />
        <ScoreRow label="Role Match" original={original.role_match_score} latest={latest.role_match_score} />
        <ScoreRow
          label="Skills"
          original={originalSkills.size ? Math.min(originalSkills.size * 5, 100) : undefined}
          latest={latestSkills.size ? Math.min(latestSkills.size * 5, 100) : undefined}
        />
      </div>

      {!isSame && newSkills.length > 0 && (
        <div className="mb-5 p-3 bg-green-500/5 border border-green-500/15 rounded-xl">
          <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">
            +{skillDelta} new skill{skillDelta !== 1 ? "s" : ""} added
          </p>
          <div className="flex flex-wrap gap-1.5">
            {newSkills.slice(0, 8).map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showText && !isSame && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Original Resume</p>
                <div className="bg-secondary/40 rounded-xl p-3 max-h-[300px] overflow-y-auto text-xs text-muted-foreground leading-relaxed prose prose-xs max-w-none">
                  <ReactMarkdown>{original.improved_resume || original.resume_text || "_No content available_"}</ReactMarkdown>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Latest Improved</p>
                <div className="bg-accent/30 rounded-xl p-3 max-h-[300px] overflow-y-auto text-xs leading-relaxed prose prose-xs max-w-none">
                  <ReactMarkdown>{latest.improved_resume || latest.resume_text || "_No content available_"}</ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSame && <div className="text-center py-4 text-xs text-muted-foreground">Upload an improved version of your resume to compare progress</div>}
    </motion.div>
  );
}
