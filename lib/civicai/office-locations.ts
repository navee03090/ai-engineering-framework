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
  "driving-license": "Traffic Police Licensing Center",
  passport: "Regional Passport Office",
  cnic: "NADRA Registration Center",
  "birth-certificate": "Union Council Office",
  "vehicle-registration": "Excise & Taxation Office",
  "property-transfer": "Sub-Registrar Office",
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

  return null;
}

/** Resolve office map pin from service + spoken/written location. No extra API calls. */
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
    officeAddress: `District office, ${city.label}, Pakistan`,
    lat: city.lat + offset.lat,
    lng: city.lng + offset.lng,
    city: city.label,
  };
}

/** Mock office coordinates for demo — default Islamabad */
export const OFFICE_LOCATIONS: Record<string, OfficeLocation> = {
  "driving-license": {
    officeName: "Islamabad Traffic Police Licensing Center",
    officeAddress: "H-9, Islamabad Traffic Police HQ, Islamabad",
    lat: 33.6498,
    lng: 73.0672,
    city: "Islamabad",
  },
  passport: {
    officeName: "Regional Passport Office Islamabad",
    officeAddress: "G-8/1, Immigration & Passports Office, Islamabad",
    lat: 33.7077,
    lng: 73.0553,
    city: "Islamabad",
  },
  cnic: {
    officeName: "NADRA Registration Center Islamabad",
    officeAddress: "NADRA HQ, State Life Building, Blue Area, Islamabad",
    lat: 33.6844,
    lng: 73.0479,
    city: "Islamabad",
  },
  "birth-certificate": {
    officeName: "Union Council Office (Islamabad)",
    officeAddress: "Sector G-6, Union Council Office, Islamabad",
    lat: 33.7157,
    lng: 73.0753,
    city: "Islamabad",
  },
  "death-certificate": {
    officeName: "Union Council Office (Islamabad)",
    officeAddress: "Sector G-6, Union Council Office, Islamabad",
    lat: 33.7157,
    lng: 73.0753,
    city: "Islamabad",
  },
  "marriage-certificate": {
    officeName: "Union Council / NADRA Office",
    officeAddress: "Sector F-8, Islamabad",
    lat: 33.6996,
    lng: 73.0362,
    city: "Islamabad",
  },
  domicile: {
    officeName: "Deputy Commissioner Office",
    officeAddress: "DC Office, G-11 Markaz, Islamabad",
    lat: 33.6678,
    lng: 72.9889,
    city: "Islamabad",
  },
  "tax-registration": {
    officeName: "FBR Regional Tax Office",
    officeAddress: "FBR House, Constitution Avenue, Islamabad",
    lat: 33.7234,
    lng: 73.0589,
    city: "Islamabad",
  },
  "vehicle-registration": {
    officeName: "Excise & Taxation Office Islamabad",
    officeAddress: "Excise Department, G-9/4, Islamabad",
    lat: 33.6599,
    lng: 73.0546,
    city: "Islamabad",
  },
  "property-transfer": {
    officeName: "Sub-Registrar Office Islamabad",
    officeAddress: "District Courts, F-8 Markaz, Islamabad",
    lat: 33.71,
    lng: 73.058,
    city: "Islamabad",
  },
  "utility-complaints": {
    officeName: "IESCO Customer Service Center",
    officeAddress: "IESCO HQ, WAPDA House, Islamabad",
    lat: 33.7074,
    lng: 73.0551,
    city: "Islamabad",
  },
  "police-complaint": {
    officeName: "Islamabad Police Station",
    officeAddress: "F-6 Markaz Police Station, Islamabad",
    lat: 33.7294,
    lng: 73.0931,
    city: "Islamabad",
  },
  "land-records": {
    officeName: "Patwari / Revenue Office",
    officeAddress: "Revenue Department, G-10 Markaz, Islamabad",
    lat: 33.6789,
    lng: 73.0123,
    city: "Islamabad",
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
