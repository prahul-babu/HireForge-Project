import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, FileText } from "lucide-react";
import { appClient } from "@/api/appClient";
import ImprovedResume from "@/components/resume/ImprovedResume";
import ResumeUploader from "@/components/resume/ResumeUploader";
import ScoreOverview from "@/components/resume/ScoreOverview";
import SkillsAnalysis from "@/components/resume/SkillsAnalysis";
import SuggestionsList from "@/components/resume/SuggestionsList";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function ResumeAnalyzer() {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const queryClient = useQueryClient();

  const { data: analyses = [] } = useQuery({
    queryKey: ["analyses"],
    queryFn: () => appClient.analyses.list("-created_date", 20)
  });

  const handleAnalysisComplete = (analysis) => {
    queryClient.invalidateQueries({ queryKey: ["analyses"] });
    setSelectedAnalysis(analysis);
    setShowUploader(false);
  };

  const current = selectedAnalysis || analyses[0];

  return (
    <div>
      <PageHeader
        title="Resume Analyzer"
        description="Locally generated resume analysis and improvement"
        action={
          <Button onClick={() => { setShowUploader(true); setSelectedAnalysis(null); }} className="rounded-xl">
            <FileText className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        }
      />

      <AnimatePresence mode="wait">
        {showUploader || !current ? (
          <motion.div key="uploader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResumeUploader onAnalysisComplete={handleAnalysisComplete} />
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {analyses.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {analyses.slice(0, 5).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAnalysis(a)}
                    className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      current?.id === a.id
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {a.target_role} · {format(new Date(a.created_date), "MMM d")}
                  </button>
                ))}
              </div>
            )}

            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Target:</span>
              <span className="text-sm font-semibold bg-accent text-accent-foreground px-3 py-1 rounded-full">{current.target_role}</span>
            </div>

            <div className="space-y-6">
              <ScoreOverview analysis={current} />
              <div className="grid lg:grid-cols-2 gap-6">
                <SkillsAnalysis existing={current.existing_skills} missing={current.skills_gap} />
                <SuggestionsList suggestions={current.suggestions} />
              </div>
              <ImprovedResume text={current.improved_resume} targetRole={current.target_role} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
