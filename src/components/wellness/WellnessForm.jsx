import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const moods = [
  { value: "great", emoji: "😄", label: "Great" },
  { value: "good", emoji: "🙂", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "low", emoji: "😔", label: "Low" },
  { value: "stressed", emoji: "😰", label: "Stressed" }
];

export default function WellnessForm({ onComplete }) {
  const [form, setForm] = useState({
    stress_level: 5,
    sleep_hours: 7,
    focus_score: 5,
    energy_level: 5,
    mood: "okay",
    notes: ""
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    await appClient.wellness.create({
      ...form,
      date: format(new Date(), "yyyy-MM-dd")
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onComplete?.();
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Daily Check-in</h2>
        <p className="text-sm text-muted-foreground mt-1">{format(new Date(), "EEEE, MMMM d")}</p>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-3 block">How are you feeling?</Label>
        <div className="flex gap-2">
          {moods.map((m) => (
            <button
              key={m.value}
              onClick={() => setForm({ ...form, mood: m.value })}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all ${
                form.mood === m.value ? "border-primary bg-accent" : "border-border hover:bg-secondary"
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[10px] font-medium text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {[
          { key: "stress_level", label: "Stress Level", max: 10 },
          { key: "sleep_hours", label: "Sleep Hours", max: 12, step: 0.5 },
          { key: "focus_score", label: "Focus Score", max: 10 },
          { key: "energy_level", label: "Energy Level", max: 10 }
        ].map((item) => (
          <div key={item.key}>
            <div className="flex justify-between mb-2">
              <Label className="text-xs text-muted-foreground">{item.label}</Label>
              <span className="text-xs font-semibold">
                {form[item.key]}
                {item.key === "sleep_hours" ? "h" : "/10"}
              </span>
            </div>
            <Slider value={[form[item.key]]} onValueChange={([v]) => setForm({ ...form, [item.key]: v })} min={0} max={item.max} step={item.step || 1} className="w-full" />
          </div>
        ))}
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Notes</Label>
        <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="How was your day?" className="resize-none min-h-[80px]" />
      </div>

      <Button onClick={handleSubmit} disabled={saving || saved} className="w-full rounded-xl">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
          </>
        ) : saved ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" /> Saved
          </>
        ) : (
          "Save Check-in"
        )}
      </Button>
    </motion.div>
  );
}
