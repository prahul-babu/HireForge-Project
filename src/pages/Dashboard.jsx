import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Heart, Sparkles, Target, TrendingUp, ArrowRight } from "lucide-react";
import { appClient } from "@/api/appClient";
import ATSProgressWidget from "@/components/dashboard/ATSProgressWidget";
import ResumeCompareWidget from "@/components/dashboard/ResumeCompareWidget";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import CircularProgress from "@/components/shared/CircularProgress";
import StatCard from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: analyses = [] } = useQuery({
    queryKey: ["analyses"],
    queryFn: () => appClient.analyses.list("-created_date", 20)
  });

  const { data: checkIns = [] } = useQuery({
    queryKey: ["wellness"],
    queryFn: () => appClient.wellness.list("-date", 30)
  });

  const latest = analyses[0];
  const avgStress = checkIns.length ? Math.round(checkIns.reduce((s, c) => s + (c.stress_level || 0), 0) / checkIns.length) : 0;
  const avgFocus = checkIns.length ? Math.round(checkIns.reduce((s, c) => s + (c.focus_score || 0), 0) / checkIns.length) : 0;
  const avgSleep = checkIns.length ? (checkIns.reduce((s, c) => s + (c.sleep_hours || 0), 0) / checkIns.length).toFixed(1) : 0;

  if (!latest && checkIns.length === 0) {
    return (
      <div>
        <PageHeader title="Welcome to HireForge" description="Your personal career growth workspace" />
        <EmptyState
          icon={Sparkles}
          title="Get Started"
          description="Paste your resume or upload a text file to generate a locally stored analysis with ATS score, role match, and tailored suggestions."
          action={
            <Link to="/analyze">
              <Button className="rounded-xl">
                <FileText className="w-4 h-4 mr-2" />
                Analyze Your Resume
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="Your career growth at a glance" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="ATS Score" value={latest?.ats_score || "—"} trend={analyses.length > 1 ? (latest?.ats_score || 0) - (analyses[1]?.ats_score || 0) : undefined} />
        <StatCard icon={Target} label="Role Match" value={latest?.role_match_score || "—"} />
        <StatCard icon={Heart} label="Avg. Stress" value={`${avgStress}/10`} subtitle="Last 30 days" />
        <StatCard icon={TrendingUp} label="Focus Score" value={`${avgFocus}/10`} subtitle="Last 30 days" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {analyses.length > 0 && <ATSProgressWidget analyses={analyses} />}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <h3 className="text-sm font-medium text-muted-foreground">Wellness Snapshot</h3>
          <div className="flex justify-center">
            <CircularProgress value={avgFocus * 10} label="Focus Score" sublabel={avgFocus >= 7 ? "Great" : avgFocus >= 5 ? "Average" : "Low"} color="hsl(var(--primary))" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg. Sleep</span>
              <span className="font-medium">{avgSleep}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Check-ins</span>
              <span className="font-medium">{checkIns.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Analyses</span>
              <span className="font-medium">{analyses.length}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {analyses.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <ResumeCompareWidget analyses={analyses} />
        </div>
      )}

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        {[
          { to: "/analyze", label: "New Analysis", icon: FileText },
          { to: "/wellness", label: "Daily Check-in", icon: Heart },
          { to: "/interview", label: "Interview Prep", icon: Target }
        ].map((item) => (
          <Link key={item.to} to={item.to}>
            <motion.div whileHover={{ y: -2 }} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
