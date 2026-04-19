import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Check,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Sparkles,
  Target,
  Twitter,
  User,
  X
} from "lucide-react";
import { appClient } from "@/api/appClient";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const AVAILABILITY_OPTIONS = [
  { value: "immediately", label: "Immediately" },
  { value: "2_weeks", label: "In 2 weeks" },
  { value: "1_month", label: "In 1 month" },
  { value: "3_months", label: "In 3 months" },
  { value: "not_looking", label: "Not actively looking" }
];

function Section({ title, icon: Icon, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent-foreground" />
        </div>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export default function Profile() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    appClient.profile.get().then((u) => {
      setUser(u);
      setForm({
        full_name: u.full_name || "",
        email: u.email || "",
        headline: u.headline || "",
        phone: u.phone || "",
        location: u.location || "",
        website: u.website || "",
        linkedin_url: u.linkedin_url || "",
        github_username: u.github_username || "",
        twitter_username: u.twitter_username || "",
        summary: u.summary || "",
        skills: u.skills || [],
        years_of_experience: u.years_of_experience || "",
        target_role: u.target_role || "",
        target_companies: u.target_companies || "",
        availability: u.availability || ""
      });
    });
  }, []);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill || form.skills.includes(skill)) {
      return;
    }
    update("skills", [...form.skills, skill]);
    setSkillInput("");
  };
  const removeSkill = (skill) => update("skills", form.skills.filter((s) => s !== skill));

  const handleSave = async () => {
    setSaving(true);
    const savedProfile = await appClient.profile.update(form);
    setUser(savedProfile);
    setForm(savedProfile);
    setSaving(false);
    setSaved(true);
    toast({ title: "Profile saved", description: "Your profile has been updated successfully." });
    setTimeout(() => setSaved(false), 2500);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Keep your profile complete for faster, better resume generation"
        action={
          <Button onClick={handleSave} disabled={saving} className="rounded-xl">
            {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : saved ? <><Check className="w-3.5 h-3.5 mr-1.5" />Saved</> : <><Check className="w-3.5 h-3.5 mr-1.5" />Save Profile</>}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-5">
        <Section title="Personal Information" icon={User}>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name">
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-xl text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>{user.full_name || "—"}</span>
                </div>
              </Field>
              <Field label="Email">
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-xl text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{user.email || "—"}</span>
                </div>
              </Field>
            </div>
            <Field label="Professional Headline">
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={form.headline} onChange={(e) => update("headline", e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="pl-9 rounded-xl" />
              </div>
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone">
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (555) 000-0000" className="pl-9 rounded-xl" />
                </div>
              </Field>
              <Field label="Location">
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="San Francisco, CA" className="pl-9 rounded-xl" />
                </div>
              </Field>
            </div>
            <Field label="Website / Portfolio">
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://yourwebsite.com" className="pl-9 rounded-xl" />
              </div>
            </Field>
            <Field label="Professional Summary">
              <Textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} placeholder="A brief overview of your background, expertise and career goals..." className="min-h-[90px] resize-none rounded-xl" />
            </Field>
          </div>
        </Section>

        <Section title="Online Profiles" icon={Linkedin}>
          <div className="grid gap-4">
            <Field label="LinkedIn Profile URL">
              <div className="relative">
                <Linkedin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-blue-500" />
                <Input value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="pl-9 rounded-xl" />
              </div>
            </Field>
            <Field label="GitHub Username">
              <div className="relative">
                <Github className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={form.github_username} onChange={(e) => update("github_username", e.target.value)} placeholder="your-github-username" className="pl-9 rounded-xl" />
              </div>
            </Field>
            <Field label="Twitter / X Handle">
              <div className="relative">
                <Twitter className="absolute left-3 top-2.5 w-3.5 h-3.5 text-sky-500" />
                <Input value={form.twitter_username} onChange={(e) => update("twitter_username", e.target.value)} placeholder="@yourhandle" className="pl-9 rounded-xl" />
              </div>
            </Field>
          </div>
        </Section>

        <Section title="Skills" icon={Sparkles}>
          <div className="space-y-4">
            <Field label="Add Skills">
              <div className="flex gap-2">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="e.g. React, Python, Figma..." className="rounded-xl flex-1" />
                <Button variant="outline" size="sm" onClick={addSkill} className="rounded-xl shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Field>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {form.skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
              {form.skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1.5 text-xs bg-accent text-accent-foreground px-2.5 py-1.5 rounded-full font-medium">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <Field label="Years of Experience">
              <Input type="number" min={0} max={50} value={form.years_of_experience} onChange={(e) => update("years_of_experience", e.target.value)} placeholder="e.g. 5" className="rounded-xl w-32" />
            </Field>
          </div>
        </Section>

        <Section title="Job Search" icon={Target}>
          <div className="grid gap-4">
            <Field label="Target Role">
              <div className="relative">
                <Target className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={form.target_role} onChange={(e) => update("target_role", e.target.value)} placeholder="e.g. Senior Product Manager" className="pl-9 rounded-xl" />
              </div>
            </Field>
            <Field label="Target Companies / Industries">
              <Textarea value={form.target_companies} onChange={(e) => update("target_companies", e.target.value)} placeholder="e.g. Google, Stripe, fintech startups..." className="min-h-[70px] resize-none rounded-xl" />
            </Field>
            <Field label="Availability">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("availability", opt.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      form.availability === opt.value ? "border-primary bg-accent text-accent-foreground" : "border-border hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </Section>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" className="rounded-xl">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : saved ? <><Check className="w-4 h-4 mr-2" />Saved</> : <><Check className="w-4 h-4 mr-2" />Save Profile</>}
        </Button>
      </div>
    </div>
  );
}
