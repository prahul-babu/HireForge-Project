import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Lightbulb, MessageSquare, Target } from "lucide-react";
import { appClient } from "@/api/appClient";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function QuestionCard({ question, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-[10px] capitalize">{question.category}</Badge>
              <span className="text-xs text-muted-foreground">Q{index + 1}</span>
            </div>
            <p className="text-sm font-medium">{question.question}</p>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{question.tip}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

export default function InterviewPrep() {
  const { data: analyses = [] } = useQuery({
    queryKey: ["analyses"],
    queryFn: () => appClient.analyses.list("-created_date", 5)
  });

  const latest = analyses[0];
  const questions = latest?.interview_questions || [];

  if (!questions.length) {
    return (
      <div>
        <PageHeader title="Interview Prep" description="Role-specific interview questions and tips" />
        <EmptyState
          icon={MessageSquare}
          title="No Questions Yet"
          description="Analyze your resume first to generate role-specific interview questions."
          action={
            <Link to="/analyze">
              <Button className="rounded-xl">Analyze Resume</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const grouped = questions.reduce((acc, q) => {
    const cat = q.category || "General";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(q);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Interview Prep" description={`Preparing for ${latest.target_role}`} />
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, qs]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold capitalize">{category}</h3>
              <span className="text-xs text-muted-foreground">({qs.length})</span>
            </div>
            <div className="space-y-2">
              {qs.map((q, i) => (
                <QuestionCard key={i} question={q} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
