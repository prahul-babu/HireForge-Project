import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Upload,
  User,
  X
} from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EMPTY_DETAILS = {
  full_name: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin_url: "",
  github_username: "",
  summary: ""
};

function StepIndicator({ current }) {
  const labels = ["Resume Source", "Personal Details", "Target Role"];
  return (
    <div className="flex items-center gap-2 mb-6">
      {labels.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                i <= current ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === current ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
          </div>
          {i < labels.length - 1 && <div className={`flex-1 h-px ${i < current ? "bg-primary" : "bg-border"}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ResumeUploader({ onAnalysisComplete }) {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [targetRole, setTargetRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStatus, setAnalyzeStatus] = useState("");
  const fileInputRef = useRef(null);

  const updateDetail = (key, value) => setDetails((d) => ({ ...d, [key]: value }));
  const canProceedSource = file || resumeText.trim() || details.linkedin_url.trim() || details.github_username.trim();
  const canProceedDetails = details.full_name.trim() && details.email.trim();

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!targetRole.trim()) {
      return;
    }
    setIsAnalyzing(true);
    setAnalyzeStatus(file ? "Reading your resume input..." : "Preparing your resume input...");
    setAnalyzeStatus("Generating a local resume analysis...");
    const saved = await appClient.analyses.createFromResume({
      details,
      targetRole,
      resumeText,
      file
    });

    setIsAnalyzing(false);
    setAnalyzeStatus("");
    onAnalysisComplete(saved);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-6">
        <StepIndicator current={step} />
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="source" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold">Import Your Profile</h2>
                <p className="text-sm text-muted-foreground mt-1">Connect LinkedIn, GitHub, upload a file, or paste your resume</p>
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-medium">
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile URL
                </Label>
                <Input value={details.linkedin_url} onChange={(e) => updateDetail("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-medium">
                  <Github className="w-3.5 h-3.5" /> GitHub Username
                </Label>
                <Input value={details.github_username} onChange={(e) => updateDetail("github_username", e.target.value)} placeholder="your-github-username" className="rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload Resume
                </Label>
                <div
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all"
                >
                  <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc,.txt" className="hidden" onChange={handleFileDrop} />
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Drop PDF or DOCX here, or click to browse</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Or paste resume text</Label>
                <Textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume content here..." className="min-h-[80px] resize-none rounded-xl" />
              </div>

              <Button onClick={() => setStep(1)} disabled={!canProceedSource} className="w-full rounded-xl">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Personal Details</h2>
                <p className="text-sm text-muted-foreground mt-1">This info will appear on your generated resume</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5"><User className="w-3 h-3" /> Full Name *</Label>
                  <Input value={details.full_name} onChange={(e) => updateDetail("full_name", e.target.value)} placeholder="Jane Doe" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email *</Label>
                  <Input type="email" value={details.email} onChange={(e) => updateDetail("email", e.target.value)} placeholder="jane@example.com" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</Label>
                  <Input value={details.phone} onChange={(e) => updateDetail("phone", e.target.value)} placeholder="+1 (555) 000-0000" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</Label>
                  <Input value={details.location} onChange={(e) => updateDetail("location", e.target.value)} placeholder="San Francisco, CA" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-medium flex items-center gap-1.5"><Globe className="w-3 h-3" /> Personal Website / Portfolio</Label>
                  <Input value={details.website} onChange={(e) => updateDetail("website", e.target.value)} placeholder="https://yourwebsite.com" className="rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-medium">Professional Summary</Label>
                  <Textarea value={details.summary} onChange={(e) => updateDetail("summary", e.target.value)} placeholder="Brief overview of your background and goals..." className="min-h-[70px] resize-none rounded-xl" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1 rounded-xl">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={() => setStep(2)} disabled={!canProceedDetails} className="flex-1 rounded-xl">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold">Target Role</h2>
                <p className="text-sm text-muted-foreground mt-1">What role are you aiming for?</p>
              </div>
              <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="rounded-xl" />
              {isAnalyzing && analyzeStatus && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  {analyzeStatus}
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} disabled={isAnalyzing} className="flex-1 rounded-xl">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={handleAnalyze} disabled={!targetRole.trim() || isAnalyzing} className="flex-1 rounded-xl">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> Build My Resume
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
