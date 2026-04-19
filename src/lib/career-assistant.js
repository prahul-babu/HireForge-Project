function latestResumeTips(latestAnalysis) {
  if (!latestAnalysis) {
    return "Start with a resume analysis and I can give more targeted suggestions from your saved data.";
  }

  const topSuggestions = (latestAnalysis.suggestions || []).slice(0, 3);
  if (!topSuggestions.length) {
    return "Your latest analysis is in a solid state. Focus on tailoring it to each job description and adding measurable wins.";
  }

  return topSuggestions.map((item) => `- ${item.suggestion}`).join("\n");
}

export async function answerCareerQuestion({ content, latestAnalysis, profile }) {
  const query = String(content || "").toLowerCase();

  if (query.includes("ats")) {
    return `ATS score estimates how readable and keyword-aligned your resume is for applicant tracking systems.\n\n${latestAnalysis ? `Your latest saved ATS score is **${latestAnalysis.ats_score}**.` : "Run an analysis to generate your first score."}`;
  }

  if (query.includes("interview")) {
    const questions = latestAnalysis?.interview_questions?.slice(0, 3) || [];
    if (!questions.length) {
      return "Run a resume analysis first and I will surface role-specific interview questions here.";
    }

    return [
      "Here are three questions to practice:",
      ...questions.map((item, index) => `${index + 1}. ${item.question}  \nTip: ${item.tip}`)
    ].join("\n\n");
  }

  if (query.includes("skill")) {
    const gap = latestAnalysis?.skills_gap || [];
    if (!gap.length) {
      return "I do not see a major skills gap in your latest saved analysis. Focus on stronger impact bullets and tailoring.";
    }

    return `The main skills to strengthen next are **${gap.slice(0, 4).join(", ")}**.\n\nBuild one concrete project or case study around each priority skill to make your resume stronger.`;
  }

  if (query.includes("resume") || query.includes("improve")) {
    return `Here are the strongest next improvements for your resume:\n\n${latestResumeTips(latestAnalysis)}`;
  }

  if (query.includes("profile")) {
    return `Your HireForge profile is available for resume generation.${profile?.target_role ? ` Your current target role is **${profile.target_role}**.` : ""}\n\nKeeping your summary, skills, and links updated will improve the generated resume output.`;
  }

  return "I can help with resume improvements, ATS explanations, interview preparation, skills gaps, and profile guidance. Ask me about any of those and I will use your locally saved data.";
}
