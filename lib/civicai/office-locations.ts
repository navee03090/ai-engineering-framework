export type OfficeLocation = {
  officeName: string;
  officeAddress: string;
  lat: number;
  lng: number;
  city: string;
};

/** Major Pakistan cities — mock coordinates for demo maps */
const PAKISTAN_CITIES: Record<string, { lat: number; lng: number; label: string }> = {
  islamabad: { lat: 33.6844, lng: 73.0479, label: "Islamabad" },
  lahore: { lat: 31.5204, lng: 74.3587, label: "Lahore" },
  karachi: { lat: 24.8607, lng: 67.0011, label: "Karachi" },
  rawalpindi: { lat: 33.5651, lng: 73.0169, label: "Rawalpindi" },
  peshawar: { lat: 34.0151, lng: 71.5249, label: "Peshawar" },
  faisalabad: { lat: 31.418, lng: 73.079, label: "Faisalabad" },
  multan: { lat: 30.1575, lng: 71.5249, label: "Multan" },
  quetta: { lat: 30.1798, lng: 66.975, label: "Quetta" },
  hyderabad: { lat: 25.396, lng: 68.3578, label: "Hyderabad" },
  gujranwala: { lat: 32.1877, lng: 74.1945, label: "Gujranwala" },
  sialkot: { lat: 32.4945, lng: 74.5229, label: "Sialkot" },
};

const SERVICE_OFFICE_LABELS: Record<string, string> = {
  "garbage-collection": "LWMC Waste Collection Office",
  "illegal-dumping": "LWMC Enforcement Unit",
  "recycling-center": "Recycling Drop-off Center",
  "industrial-waste": "EPA Industrial Compliance Office",
  "hazardous-waste": "EPA Hazardous Waste Unit",
  "blocked-drain": "WASA Complaint Cell",
  "plastic-pollution": "Environmental Protection Office",
  "air-pollution": "EPA Air Quality Monitoring",
  "water-pollution": "EPA Water Quality Unit",
  "tree-plantation": "Parks & Horticulture Office",
  "public-cleaning": "LWMC Sanitation Division",
  "environmental-complaint": "EPA Complaint Center",
};

function slugOffset(slug: string): { lat: number; lng: number } {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash += slug.charCodeAt(i);
  }
  return { lat: (hash % 7) * 0.006, lng: ((hash * 2) % 7) * 0.006 };
}

/** Detect city from voice/text query or intent entities (Roman Urdu + English). */
export function detectCityFromText(...parts: string[]): string | null {
  const combined = parts.join(" ").toLowerCase();

  for (const [key, city] of Object.entries(PAKISTAN_CITIES)) {
    if (combined.includes(key) || combined.includes(city.label.toLowerCase())) {
      return key;
    }
  }

  if (combined.includes("ring road")) {
    return "lahore";
  }

  return null;
}

/** Resolve facility map pin from service + spoken/written location. No extra API calls. */
export function resolveOfficeLocation(
  serviceSlug: string,
  options?: { entities?: string[]; query?: string }
): OfficeLocation | null {
  const base = OFFICE_LOCATIONS[serviceSlug];
  if (!base) return null;

  const cityKey =
    detectCityFromText(...(options?.entities ?? []), options?.query ?? "") ??
    "islamabad";

  if (cityKey === "islamabad") {
    return base;
  }

  const city = PAKISTAN_CITIES[cityKey];
  const officeLabel = SERVICE_OFFICE_LABELS[serviceSlug] ?? base.officeName;
  const offset = slugOffset(serviceSlug);

  return {
    officeName: `${officeLabel} — ${city.label}`,
    officeAddress: `District facility, ${city.label}, Pakistan`,
    lat: city.lat + offset.lat,
    lng: city.lng + offset.lng,
    city: city.label,
  };
}

/** Mock facility coordinates for demo — default Islamabad */
export const OFFICE_LOCATIONS: Record<string, OfficeLocation> = {
  "garbage-collection": {
    officeName: "LWMC Waste Collection Office",
    officeAddress: "LWMC HQ, Ferozepur Road, Lahore",
    lat: 31.5204,
    lng: 74.3587,
    city: "Lahore",
  },
  "illegal-dumping": {
    officeName: "LWMC Enforcement Unit — Ring Road Hotspot",
    officeAddress: "Ring Road, near Niazi Chowk, Lahore",
    lat: 31.485,
    lng: 74.32,
    city: "Lahore",
  },
  "recycling-center": {
    officeName: "Lahore Recycling Drop-off Center",
    officeAddress: "Gulberg III, Recycling Facility, Lahore",
    lat: 31.5105,
    lng: 74.3447,
    city: "Lahore",
  },
  "industrial-waste": {
    officeName: "EPA Punjab Industrial Compliance Office",
    officeAddress: "EPA Punjab HQ, 38-E/1, Gulberg III, Lahore",
    lat: 31.5123,
    lng: 74.3456,
    city: "Lahore",
  },
  "hazardous-waste": {
    officeName: "EPA Hazardous Waste Unit",
    officeAddress: "EPA Punjab HQ, Gulberg III, Lahore",
    lat: 31.5125,
    lng: 74.346,
    city: "Lahore",
  },
  "blocked-drain": {
    officeName: "WASA Complaint Cell Lahore",
    officeAddress: "WASA HQ, 37-Ferozepur Road, Lahore",
    lat: 31.5497,
    lng: 74.3436,
    city: "Lahore",
  },
  "plastic-pollution": {
    officeName: "Canal Pollution Hotspot — BRB Canal",
    officeAddress: "BRB Canal, Gulberg, Lahore",
    lat: 31.505,
    lng: 74.335,
    city: "Lahore",
  },
  "air-pollution": {
    officeName: "EPA Air Quality Monitoring Station",
    officeAddress: "Township, Lahore",
    lat: 31.47,
    lng: 74.29,
    city: "Lahore",
  },
  "water-pollution": {
    officeName: "EPA Water Quality Unit — Ravi River",
    officeAddress: "Ravi River monitoring point, Lahore",
    lat: 31.58,
    lng: 74.38,
    city: "Lahore",
  },
  "tree-plantation": {
    officeName: "Parks & Horticulture Authority",
    officeAddress: "Lawrence Gardens, Lahore",
    lat: 31.568,
    lng: 74.312,
    city: "Lahore",
  },
  "public-cleaning": {
    officeName: "LWMC Sanitation Division",
    officeAddress: "LWMC HQ, Ferozepur Road, Lahore",
    lat: 31.521,
    lng: 74.359,
    city: "Lahore",
  },
  "environmental-complaint": {
    officeName: "EPA Punjab Complaint Center",
    officeAddress: "EPA Punjab HQ, Gulberg III, Lahore",
    lat: 31.512,
    lng: 74.345,
    city: "Lahore",
  },
};

export function getOfficeLocation(serviceSlug: string): OfficeLocation | null {
  return OFFICE_LOCATIONS[serviceSlug] ?? null;
}

export function getOfficeLocationFromQuery(
  serviceSlug: string,
  entities: string[] = [],
  query = ""
): OfficeLocation | null {
  return resolveOfficeLocation(serviceSlug, { entities, query });
}

export function getGoogleMapsDirectionsUrl(location: OfficeLocation): string {
  const query = encodeURIComponent(`${location.officeName}, ${location.officeAddress}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
}
