import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, BookOpen, FolderOpen, Map } from "lucide-react";
import { appClient } from "@/api/appClient";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CareerRoadmap() {
  const { data: analyses = [] } = useQuery({
    queryKey: ["analyses"],
    queryFn: () => appClient.analyses.list("-created_date", 5)
  });

  const latest = analyses[0];
  const roadmap = latest?.career_roadmap || [];

  if (!roadmap.length) {
    return (
      <div>
        <PageHeader title="Career Roadmap" description="Your personalized path to your dream role" />
        <EmptyState
          icon={Map}
          title="No Roadmap Yet"
          description="Analyze your resume first to generate a personalized career roadmap."
          action={
            <Link to="/analyze">
              <Button className="rounded-xl">Get Started</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Career Roadmap" description={`Your path to ${latest.target_role}`} />
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />
        <div className="space-y-6">
          {roadmap.map((phase, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="relative sm:pl-16">
              <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-primary border-4 border-background hidden sm:block" />
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h3 className="text-base font-semibold">{phase.phase}</h3>
                  <Badge variant="secondary" className="w-fit text-xs">{phase.duration}</Badge>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Skills to Learn</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(phase.skills || []).map((s, j) => (
                        <Badge key={j} variant="secondary" className="text-[10px] font-normal">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Award className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Certifications</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(phase.certifications || []).map((c, j) => (
                        <Badge key={j} variant="secondary" className="text-[10px] font-normal">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <FolderOpen className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Projects</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(phase.projects || []).map((p, j) => (
                        <Badge key={j} variant="secondary" className="text-[10px] font-normal">{p}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: roadmap.length * 0.15 }} className="relative sm:pl-16">
            <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-green-500 border-4 border-background hidden sm:block" />
            <div className="bg-green-500/10 rounded-2xl border border-green-500/20 p-6 text-center">
              <h3 className="text-base font-semibold text-green-600">🎯 {latest.target_role}</h3>
              <p className="text-sm text-muted-foreground mt-1">Your target destination</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
