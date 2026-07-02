export type CivicPromptPackId = "emergency" | "services" | "social";

export type CivicPromptPack = {
  id: CivicPromptPackId;
  label: string;
  taglineUrdu: string;
  headline: string;
  subhead: string;
  classifyTemplateId: string;
  reportTitleLabel: string;
  reportDescriptionPlaceholder: string;
};

export const PAKISTAN_DISTRICTS = [
  "Peshawar",
  "Mardan",
  "Swat",
  "Abbottabad",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Karachi",
  "Quetta",
  "Multan",
  "Other",
] as const;

export const CIVIC_PROMPT_PACKS: Record<CivicPromptPackId, CivicPromptPack> = {
  emergency: {
    id: "emergency",
    label: "Emergency Response",
    taglineUrdu: "شہری ایمرجنسی — AI سے ترجیح",
    headline: "Pakistan Civic Intelligence Command",
    subhead:
      "Citizens report emergencies. Multi-agent AI classifies severity, summarizes for coordinators, and escalates critical cases.",
    classifyTemplateId: "civic.emergency.classify",
    reportTitleLabel: "Incident title",
    reportDescriptionPlaceholder:
      "Describe what happened, who is affected, and immediate danger (roads, injuries, infrastructure)...",
  },
  services: {
    id: "services",
    label: "Public Services",
    taglineUrdu: "عوامی خدمات — AI سے ترجیح",
    headline: "Pakistan Civic Services Command",
    subhead:
      "Report water, power, roads, and sanitation issues. AI triages reports so teams fix what matters first.",
    classifyTemplateId: "civic.services.classify",
    reportTitleLabel: "Service issue title",
    reportDescriptionPlaceholder:
      "Describe the public service problem, location details, and how long it has persisted...",
  },
  social: {
    id: "social",
    label: "Community & Social",
    taglineUrdu: "شہری مسائل — AI سے ترجیح",
    headline: "Pakistan Civic Community Command",
    subhead:
      "Report health, education, and community safety concerns. AI prioritizes cases for local coordinators.",
    classifyTemplateId: "civic.social.classify",
    reportTitleLabel: "Report title",
    reportDescriptionPlaceholder:
      "Describe the community issue, affected people, and urgency for local response...",
  },
};

export function getActiveCivicPack(): CivicPromptPack {
  const raw = process.env.CIVIC_PROMPT_PACK ?? "emergency";
  const pack = CIVIC_PROMPT_PACKS[raw as CivicPromptPackId];
  return pack ?? CIVIC_PROMPT_PACKS.emergency;
}

export function getActiveCivicPackId(): CivicPromptPackId {
  return getActiveCivicPack().id;
}
