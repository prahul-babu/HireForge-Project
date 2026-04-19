const COMMON_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "Next.js",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Accessibility",
  "Performance",
  "Testing",
  "Jest",
  "Cypress",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "REST APIs",
  "GraphQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Git",
  "Figma",
  "Product Strategy",
  "Roadmapping",
  "Agile",
  "Scrum",
  "Data Analysis",
  "Machine Learning",
  "Communication",
  "Leadership",
  "Problem Solving"
];

const ROLE_SKILLS = {
  frontend: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Accessibility", "Performance", "Testing"],
  backend: ["Node.js", "APIs", "SQL", "PostgreSQL", "Docker", "System Design", "Testing", "AWS"],
  fullstack: ["React", "TypeScript", "Node.js", "APIs", "SQL", "Testing", "Docker", "Git"],
  product: ["Product Strategy", "Roadmapping", "Agile", "Communication", "Data Analysis", "Leadership"],
  data: ["Python", "SQL", "Data Analysis", "Machine Learning", "Communication", "Git"],
  design: ["Figma", "Research", "Accessibility", "Communication", "Design Systems", "Prototyping"]
};

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function roleBucket(targetRole) {
  const role = normalizeText(targetRole);

  if (role.includes("front")) return "frontend";
  if (role.includes("back")) return "backend";
  if (role.includes("full")) return "fullstack";
  if (role.includes("product")) return "product";
  if (role.includes("data") || role.includes("analyst") || role.includes("machine")) return "data";
  if (role.includes("design") || role.includes("ux") || role.includes("ui")) return "design";

  return "fullstack";
}

function extractSkills(text, details) {
  const haystack = normalizeText([
    text,
    details.summary,
    details.headline,
    details.target_role,
    details.skills?.join(" ")
  ].join(" "));

  const detected = COMMON_SKILLS.filter((skill) => haystack.includes(skill.toLowerCase()));
  return uniq([...(details.skills || []), ...detected]);
}

function splitHighlights(text) {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter((line) => line.length > 30 && line.length < 220)
    .slice(0, 6);
}

function buildAtsScore({ details, extractedSkills, text, missingSkills }) {
  let score = 38;

  if (details.full_name && details.email) score += 12;
  if (details.phone || details.location) score += 6;
  if (details.summary) score += 10;
  if ((details.skills || []).length >= 4) score += 8;
  if (extractedSkills.length >= 6) score += 10;
  if (/\b(experience|projects|skills|education)\b/i.test(text)) score += 8;
  if (/\d/.test(text)) score += 8;
  if (text.length > 700) score += 6;
  score -= Math.min(missingSkills.length * 2, 14);

  return Math.max(35, Math.min(Math.round(score), 96));
}

function buildRoleMatchScore(targetRole, extractedSkills, missingSkills) {
  const required = ROLE_SKILLS[roleBucket(targetRole)] || [];
  const matched = required.filter((skill) => extractedSkills.includes(skill));
  const baseline = 42 + matched.length * 7 - missingSkills.length * 3;

  return Math.max(30, Math.min(Math.round(baseline), 95));
}

function buildSuggestions({ details, extractedSkills, missingSkills, text, unsupportedFile }) {
  const suggestions = [];

  if (missingSkills.length) {
    suggestions.push({
      category: "skills_gap",
      priority: "high",
      suggestion: `Add evidence for these target-role skills: ${missingSkills.slice(0, 4).join(", ")}.`
    });
  }

  if (!/\d/.test(text)) {
    suggestions.push({
      category: "impact",
      priority: "high",
      suggestion: "Add quantified outcomes to your experience bullets so recruiters can see your impact quickly."
    });
  }

  if (!details.summary || details.summary.length < 80) {
    suggestions.push({
      category: "summary",
      priority: "medium",
      suggestion: "Strengthen the professional summary with your years of experience, domain focus, and top strengths."
    });
  }

  if (extractedSkills.length < 6) {
    suggestions.push({
      category: "keywords",
      priority: "medium",
      suggestion: "Add a dedicated core skills section with the tools, platforms, and methods you use most often."
    });
  }

  if (!details.linkedin_url && !details.website && !details.github_username) {
    suggestions.push({
      category: "credibility",
      priority: "low",
      suggestion: "Add at least one professional profile or portfolio link so hiring teams can validate your work."
    });
  }

  if (unsupportedFile) {
    suggestions.push({
      category: "self_hosted_mode",
      priority: "medium",
      suggestion: "For the self-hosted version, paste resume text directly when using PDF or DOCX files so the local analyzer has more content to work with."
    });
  }

  return suggestions;
}

function buildResumeMarkdown({ details, targetRole, extractedSkills, highlights, missingSkills }) {
  const contactLine = [
    details.email,
    details.phone,
    details.location,
    details.website,
    details.linkedin_url,
    details.github_username ? `github.com/${details.github_username}` : ""
  ].filter(Boolean).join(" | ");

  const summary = details.summary
    || `${details.full_name || "Candidate"} is targeting a ${targetRole} opportunity and brings strengths in ${extractedSkills.slice(0, 5).join(", ") || "communication, delivery, and problem solving"}.`;

  const projectIdeas = missingSkills.slice(0, 3).map((skill) => `Build a portfolio project that demonstrates ${skill} in a practical setting.`);
  const polishedHighlights = highlights.length
    ? highlights.map((item) => `- ${item}`)
    : [
        `- Delivered work aligned to ${targetRole} expectations with a focus on measurable outcomes.`,
        `- Collaborated across teams and communicated progress clearly to stakeholders.`,
        `- Strengthened execution quality through documentation, iteration, and continuous improvement.`
      ];

  return [
    `# ${details.full_name || "Your Name"}`,
    contactLine || "Email | Phone | Location | Portfolio",
    "",
    `## Professional Summary`,
    summary,
    "",
    `## Target Role`,
    targetRole,
    "",
    `## Core Skills`,
    ...(extractedSkills.length ? extractedSkills.map((skill) => `- ${skill}`) : ["- Add your top tools, platforms, and strengths here."]),
    "",
    `## Experience Highlights`,
    ...polishedHighlights,
    "",
    `## Projects`,
    ...(projectIdeas.length ? projectIdeas.map((item) => `- ${item}`) : ["- Add one project that shows end-to-end ownership and impact."]),
    "",
    `## Education`,
    "- Add your education, certifications, or professional development here."
  ].join("\n");
}

function buildRoadmap(targetRole, missingSkills, extractedSkills) {
  const relevantSkills = missingSkills.length ? missingSkills : extractedSkills.slice(0, 6);
  const first = relevantSkills.slice(0, 2);
  const second = relevantSkills.slice(2, 4);
  const third = relevantSkills.slice(4, 6);

  return [
    {
      phase: "Foundation",
      duration: "0-30 days",
      skills: first.length ? first : ["Resume tailoring", "Storytelling"],
      certifications: ["Resume refresh", "LinkedIn refresh"],
      projects: [`Create a focused ${targetRole} resume version for your top applications.`]
    },
    {
      phase: "Portfolio Proof",
      duration: "30-60 days",
      skills: second.length ? second : ["Interview readiness", "Project case studies"],
      certifications: ["Mock interview practice"],
      projects: [`Ship one portfolio piece that demonstrates ${targetRole} impact.`]
    },
    {
      phase: "Interview Conversion",
      duration: "60-90 days",
      skills: third.length ? third : ["Negotiation", "Stakeholder communication"],
      certifications: ["Target-company preparation"],
      projects: [`Prepare success stories and measurable outcomes for ${targetRole} interviews.`]
    }
  ];
}

function buildInterviewQuestions(targetRole, extractedSkills) {
  const topSkills = extractedSkills.slice(0, 3).join(", ") || "your core skills";

  return [
    { category: "experience", question: `Walk me through a project that best prepared you for a ${targetRole} role.`, tip: "Use situation, actions, and measurable outcomes in that order." },
    { category: "technical", question: `How have you applied ${topSkills} in a real project?`, tip: "Focus on tradeoffs, not just tools." },
    { category: "impact", question: "Tell me about a time you improved a process, metric, or user outcome.", tip: "Quantify the before and after if you can." },
    { category: "collaboration", question: "How do you work with cross-functional teammates when priorities conflict?", tip: "Show empathy, alignment, and decision-making." },
    { category: "problem_solving", question: "Describe a challenging issue you diagnosed and resolved under pressure.", tip: "Explain how you narrowed the problem space." },
    { category: "ownership", question: "What is an example of something you owned end to end?", tip: "Highlight initiative and follow-through." },
    { category: "growth", question: `What skills are you currently strengthening to become a stronger ${targetRole}?`, tip: "Mention an active learning plan and practical application." },
    { category: "quality", question: "How do you make sure your work is reliable and high quality?", tip: "Discuss reviews, testing, validation, or feedback loops." },
    { category: "prioritization", question: "How do you decide what to tackle first when everything feels urgent?", tip: "Talk through impact, effort, and stakeholder context." },
    { category: "motivation", question: `Why are you specifically interested in this ${targetRole} opportunity?`, tip: "Connect your background to the role's mission and problems." }
  ];
}

export async function buildResumeAnalysis({ details, targetRole, resumeText, fileText, fileSupported }) {
  const combinedText = [resumeText, fileText, details.summary].filter(Boolean).join("\n");
  const extractedSkills = extractSkills(combinedText, details);
  const requiredSkills = ROLE_SKILLS[roleBucket(targetRole)] || [];
  const missingSkills = requiredSkills.filter((skill) => !extractedSkills.includes(skill));
  const highlights = splitHighlights(combinedText);

  return {
    target_role: targetRole,
    resume_text: combinedText,
    file_url: "",
    ats_score: buildAtsScore({ details, extractedSkills, text: combinedText, missingSkills }),
    role_match_score: buildRoleMatchScore(targetRole, extractedSkills, missingSkills),
    existing_skills: extractedSkills,
    skills_gap: missingSkills,
    suggestions: buildSuggestions({
      details,
      extractedSkills,
      missingSkills,
      text: combinedText,
      unsupportedFile: !fileSupported
    }),
    improved_resume: buildResumeMarkdown({
      details,
      targetRole,
      extractedSkills,
      highlights,
      missingSkills
    }),
    career_roadmap: buildRoadmap(targetRole, missingSkills, extractedSkills),
    interview_questions: buildInterviewQuestions(targetRole, extractedSkills)
  };
}
