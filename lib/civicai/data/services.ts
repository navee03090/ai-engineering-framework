import type { GovernmentService } from "@/lib/civicai/types";

export const GOVERNMENT_SERVICES: GovernmentService[] = [
  {
    id: "garbage-collection",
    name: "Garbage Collection",
    slug: "garbage-collection",
    category: "waste",
    department: "Lahore Waste Management Company (LWMC)",
    description:
      "Report missed garbage collection, overflowing bins, or schedule municipal pickup.",
    fee: "Free municipal service",
    processingTime: "24–48 hours",
    documents: [
      "Photo of overflowing garbage",
      "GPS location or landmark",
      "Date and time observed",
      "Brief description",
    ],
    icon: "Trash2",
    popular: true,
  },
  {
    id: "illegal-dumping",
    name: "Illegal Dumping",
    slug: "illegal-dumping",
    category: "waste",
    department: "Lahore Waste Management Company (LWMC)",
    description:
      "Report unauthorized waste disposal, illegal dumping sites, and fly-tipping near roads or vacant plots.",
    fee: "Free municipal service",
    processingTime: "24–72 hours",
    documents: [
      "Photo of dumped waste",
      "GPS location or landmark",
      "Date observed",
      "Type of waste if known",
    ],
    icon: "AlertTriangle",
    popular: true,
  },
  {
    id: "recycling-center",
    name: "Recycling Center",
    slug: "recycling-center",
    category: "recycling",
    department: "Punjab Environmental Protection Department",
    description:
      "Find nearby recycling centers for paper, plastic, metal, and e-waste disposal.",
    fee: "Free or nominal fee",
    processingTime: "Same day (drop-off)",
    documents: [
      "List of materials to recycle",
      "Photo of items (optional)",
      "Preferred city/area",
    ],
    icon: "Recycle",
  },
  {
    id: "industrial-waste",
    name: "Industrial Waste",
    slug: "industrial-waste",
    category: "pollution",
    department: "Environmental Protection Agency (EPA) Punjab",
    description:
      "Report industrial waste dumping, factory emissions, or unauthorized disposal of manufacturing byproducts.",
    fee: "Free complaint service",
    processingTime: "3–7 working days",
    documents: [
      "Photo or video evidence",
      "Factory or site location",
      "Date and time",
      "Description of waste type",
    ],
    icon: "Factory",
  },
  {
    id: "hazardous-waste",
    name: "Hazardous Waste",
    slug: "hazardous-waste",
    category: "pollution",
    department: "Environmental Protection Agency (EPA) Punjab",
    description:
      "Report chemical waste, medical waste, batteries, or other hazardous materials improperly disposed.",
    fee: "Free emergency reporting",
    processingTime: "12–48 hours (urgent: same day)",
    documents: [
      "Photo from safe distance",
      "Exact location",
      "Type of hazard if known",
      "CNIC for follow-up",
    ],
    icon: "Biohazard",
  },
  {
    id: "blocked-drain",
    name: "Blocked Drain",
    slug: "blocked-drain",
    category: "infrastructure",
    department: "Water & Sanitation Agency (WASA)",
    description:
      "Report blocked drains, sewage overflow, and stagnant water causing health hazards.",
    fee: "Free municipal service",
    processingTime: "24–72 hours",
    documents: [
      "Photo of blocked drain",
      "Street address or landmark",
      "Duration of blockage",
      "Flood or overflow status",
    ],
    icon: "Droplets",
  },
  {
    id: "plastic-pollution",
    name: "Plastic Pollution",
    slug: "plastic-pollution",
    category: "pollution",
    department: "Punjab Environmental Protection Department",
    description:
      "Report plastic waste in canals, parks, roadsides, and public spaces.",
    fee: "Free municipal service",
    processingTime: "3–5 working days",
    documents: [
      "Photo of plastic accumulation",
      "Water body or park name",
      "Approximate area size",
      "Date observed",
    ],
    icon: "Package",
  },
  {
    id: "air-pollution",
    name: "Air Pollution",
    slug: "air-pollution",
    category: "pollution",
    department: "Environmental Protection Agency (EPA) Punjab",
    description:
      "Report smoke from burning garbage, industrial chimneys, or vehicle emissions causing air quality issues.",
    fee: "Free complaint service",
    processingTime: "2–5 working days",
    documents: [
      "Photo or video of smoke source",
      "Location and landmark",
      "Time of day",
      "Duration of pollution",
    ],
    icon: "Wind",
  },
  {
    id: "water-pollution",
    name: "Water Pollution",
    slug: "water-pollution",
    category: "pollution",
    department: "Environmental Protection Agency (EPA) Punjab",
    description:
      "Report polluted canals, rivers, groundwater contamination, or industrial discharge into water bodies.",
    fee: "Free complaint service",
    processingTime: "3–7 working days",
    documents: [
      "Photo of discolored or foamy water",
      "Canal or river name",
      "Upstream source if visible",
      "Date observed",
    ],
    icon: "Waves",
    popular: true,
  },
  {
    id: "tree-plantation",
    name: "Tree Plantation",
    slug: "tree-plantation",
    category: "green",
    department: "Forest & Wildlife Department / Parks Authority",
    description:
      "Request tree plantation, report illegal tree cutting, or join municipal greening programs.",
    fee: "Free (community programs)",
    processingTime: "7–30 days",
    documents: [
      "Location for plantation",
      "Number of trees requested",
      "Land ownership status",
      "Contact for follow-up",
    ],
    icon: "TreePine",
  },
  {
    id: "public-cleaning",
    name: "Public Cleaning",
    slug: "public-cleaning",
    category: "waste",
    department: "Lahore Waste Management Company (LWMC)",
    description:
      "Request public area cleaning, street sweeping, or post-event cleanup in parks and markets.",
    fee: "Free municipal service",
    processingTime: "24–48 hours",
    documents: [
      "Photo of area needing cleaning",
      "Public place name",
      "Event date if applicable",
      "Size of area",
    ],
    icon: "Sparkles",
  },
  {
    id: "environmental-complaint",
    name: "Environmental Complaint",
    slug: "environmental-complaint",
    category: "general",
    department: "Pakistan Environmental Protection Agency",
    description:
      "General environmental complaints — noise, odor, wildlife disturbance, or unclassified environmental issues.",
    fee: "Free complaint service",
    processingTime: "5–10 working days",
    documents: [
      "Description of issue",
      "Location",
      "Date and duration",
      "Supporting photos or videos",
    ],
    icon: "MessageSquare",
  },
];

export const SERVICE_CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "waste", label: "Waste Management" },
  { id: "recycling", label: "Recycling" },
  { id: "pollution", label: "Pollution" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "green", label: "Green Initiatives" },
  { id: "general", label: "General" },
] as const;

export function getServiceById(id: string) {
  return GOVERNMENT_SERVICES.find((s) => s.id === id || s.slug === id);
}

export function getPopularServices() {
  return GOVERNMENT_SERVICES.filter((s) => s.popular);
}
