import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain, Heart, Moon, Zap } from "lucide-react";
import { appClient } from "@/api/appClient";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import WellnessCharts from "@/components/wellness/WellnessCharts";
import WellnessForm from "@/components/wellness/WellnessForm";
import WellnessInsights from "@/components/wellness/WellnessInsights";

export default function Wellness() {
  const queryClient = useQueryClient();
  const { data: checkIns = [] } = useQuery({
    queryKey: ["wellness"],
    queryFn: () => appClient.wellness.list("-date", 30)
  });

  const recent = checkIns.slice(0, 7);
  const avg = (key) => (recent.length ? (recent.reduce((s, c) => s + (c[key] || 0), 0) / recent.length).toFixed(1) : "—");

  return (
    <div>
      <PageHeader title="Wellness Tracker" description="Monitor your wellbeing for peak performance" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Heart} label="Avg. Stress" value={`${avg("stress_level")}/10`} subtitle="Last 7 days" />
        <StatCard icon={Moon} label="Avg. Sleep" value={`${avg("sleep_hours")}h`} subtitle="Last 7 days" />
        <StatCard icon={Brain} label="Focus" value={`${avg("focus_score")}/10`} subtitle="Last 7 days" />
        <StatCard icon={Zap} label="Energy" value={`${avg("energy_level")}/10`} subtitle="Last 7 days" />
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <WellnessForm onComplete={() => queryClient.invalidateQueries({ queryKey: ["wellness"] })} />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <WellnessCharts checkIns={checkIns} />
          <WellnessInsights checkIns={checkIns} />
        </div>
      </div>
    </div>
  );
}
