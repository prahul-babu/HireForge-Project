import { answerCareerQuestion } from "@/lib/career-assistant";
import { createAnalysis, createWellnessEntry, getProfile, listAnalyses, listWellnessEntries, updateProfile } from "@/lib/local-store";
import { buildResumeAnalysis } from "@/lib/resume-engine";
import {
  createRemoteAnalysis,
  createRemoteWellnessEntry,
  getRemoteProfile,
  listRemoteAnalyses,
  listRemoteWellnessEntries,
  updateRemoteProfile
} from "@/lib/supabase-store";
import { isSupabaseConfigured } from "@/lib/supabase-client";

async function readFileText(file) {
  if (!file) {
    return { text: "", supported: true };
  }

  const fileName = String(file.name || "").toLowerCase();
  const isTextLike = file.type.startsWith("text/") || fileName.endsWith(".txt") || fileName.endsWith(".md");

  if (!isTextLike) {
    return { text: "", supported: false };
  }

  return {
    text: await file.text(),
    supported: true
  };
}

export const appClient = {
  profile: {
    get: () => (isSupabaseConfigured ? getRemoteProfile() : getProfile()),
    update: (data) => (isSupabaseConfigured ? updateRemoteProfile(data) : updateProfile(data))
  },
  analyses: {
    list: (sort, limit) => (isSupabaseConfigured ? listRemoteAnalyses(limit) : listAnalyses(sort, limit)),
    createFromResume: async ({ details, targetRole, resumeText, file }) => {
      const { text: fileText, supported } = await readFileText(file);
      const analysis = await buildResumeAnalysis({
        details,
        targetRole,
        resumeText,
        fileText,
        fileSupported: supported
      });

      const profileUpdates = {
        full_name: details.full_name,
        email: details.email,
        phone: details.phone,
        location: details.location,
        website: details.website,
        linkedin_url: details.linkedin_url,
        github_username: details.github_username,
        summary: details.summary,
        target_role: targetRole
      };

      if (isSupabaseConfigured) {
        await updateRemoteProfile(profileUpdates);
        return createRemoteAnalysis(analysis);
      }

      await updateProfile(profileUpdates);
      return createAnalysis(analysis);
    }
  },
  wellness: {
    list: (sort, limit) => (isSupabaseConfigured ? listRemoteWellnessEntries(limit) : listWellnessEntries(sort, limit)),
    create: (data) => (isSupabaseConfigured ? createRemoteWellnessEntry(data) : createWellnessEntry(data))
  },
  assistant: {
    reply: async ({ content }) => {
      const [latestAnalysis] = await listAnalyses("-created_date", 1);
      const profile = await getProfile();
      return answerCareerQuestion({
        content,
        latestAnalysis,
        profile
      });
    }
  }
};
