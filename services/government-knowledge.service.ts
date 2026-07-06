import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/api/errors";
import { getOfficeLocation } from "@/lib/civicai/office-locations";
import { GOVERNMENT_SERVICES, getServiceById } from "@/lib/civicai/data/services";
import type { KnowledgeOutput } from "@/agents/civicai-schemas";

type DbService = {
  slug: string;
  name: string;
  category: string;
  department: string;
  office_name: string | null;
  office_address: string | null;
  description: string;
  fee: string;
  processing_time: string;
  documents: string[];
  warnings: string[];
  instructions: string[];
  icon: string | null;
  popular: boolean;
};

function mapDbToKnowledge(row: DbService): KnowledgeOutput {
  return {
    serviceSlug: row.slug,
    serviceName: row.name,
    category: row.category,
    department: row.department,
    officeName: row.office_name,
    officeAddress: row.office_address,
    fee: row.fee,
    processingTime: row.processing_time,
    documents: row.documents ?? [],
    warnings: row.warnings ?? [],
    instructions: row.instructions ?? [],
    description: row.description,
  };
}

function mapMockToKnowledge(slug: string): KnowledgeOutput | null {
  const mock = getServiceById(slug);
  if (!mock) return null;
  const office = getOfficeLocation(slug);
  return {
    serviceSlug: mock.slug,
    serviceName: mock.name,
    category: mock.category,
    department: mock.department,
    officeName: office?.officeName ?? null,
    officeAddress: office?.officeAddress ?? null,
    fee: mock.fee,
    processingTime: mock.processingTime,
    documents: mock.documents,
    warnings: [],
    instructions: [],
    description: mock.description,
  };
}

export const governmentKnowledgeService = {
  async getBySlug(slug: string): Promise<KnowledgeOutput> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("government_services")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return mapDbToKnowledge(data as DbService);
      }
    } catch {
      // Fall through to mock data when Supabase unavailable
    }

    const mock = mapMockToKnowledge(slug);
    if (mock) return mock;

    throw new AppError(
      `Government service not found: ${slug}`,
      404,
      "SERVICE_NOT_FOUND"
    );
  },

  async list() {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("government_services")
        .select("*")
        .order("popular", { ascending: false })
        .order("name");

      if (!error && data?.length) {
        return data.map((row) => mapDbToKnowledge(row as DbService));
      }
    } catch {
      // fallback
    }

    return GOVERNMENT_SERVICES.map((s) => mapMockToKnowledge(s.slug)!);
  },

  getServiceIndex(): string {
    return GOVERNMENT_SERVICES.map((s) => `${s.slug} | ${s.name}`).join("\n");
  },
};
