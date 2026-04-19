import { answerCareerQuestion } from "@/lib/career-assistant";
import { createAnalysis, createWellnessEntry, getProfile, listAnalyses, listWellnessEntries, updateProfile } from "@/lib/local-store";
import { buildResumeAnalysis } from "@/lib/resume-engine";

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
    get: () => getProfile(),
    update: (data) => updateProfile(data)
  },
  analyses: {
    list: (sort, limit) => listAnalyses(sort, limit),
    createFromResume: async ({ details, targetRole, resumeText, file }) => {
      const { text: fileText, supported } = await readFileText(file);
      const analysis = await buildResumeAnalysis({
        details,
        targetRole,
        resumeText,
        fileText,
        fileSupported: supported
      });

      await updateProfile({
        full_name: details.full_name,
        email: details.email,
        phone: details.phone,
        location: details.location,
        website: details.website,
        linkedin_url: details.linkedin_url,
        github_username: details.github_username,
        summary: details.summary,
        target_role: targetRole
      });

      return createAnalysis(analysis);
    }
  },
  wellness: {
    list: (sort, limit) => listWellnessEntries(sort, limit),
    create: (data) => createWellnessEntry(data)
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
