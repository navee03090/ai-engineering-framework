import type {
  AuthorityReportItem,
  AuthorityRequestItem,
} from "@/services/civicai-authority.service";

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

async function parseApi<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error ?? "Request failed");
  }
  return json.data;
}

export type AuthorityStats = {
  totalRequests: number;
  totalVerifications: number;
  totalReports: number;
  uniqueCitizens: number;
  byStatus: Record<string, number>;
};

export async function fetchAuthorityStats(): Promise<AuthorityStats> {
  const res = await fetch("/api/civicai/authority/stats");
  return parseApi<AuthorityStats>(res);
}

export async function fetchAuthorityRequests(): Promise<AuthorityRequestItem[]> {
  const res = await fetch("/api/civicai/authority/requests");
  const data = await parseApi<{ items: AuthorityRequestItem[] }>(res);
  return data.items;
}

export async function fetchAuthorityReports(): Promise<AuthorityReportItem[]> {
  const res = await fetch("/api/civicai/authority/reports");
  const data = await parseApi<{ items: AuthorityReportItem[] }>(res);
  return data.items;
}

export type AuthorityReportDetail = {
  id: string;
  summary: string;
  report_json: unknown;
  service_slug: string | null;
  qr_data: string | null;
  created_at: string;
  user_id: string;
  request_id: string | null;
  reporterEmail: string | null;
  reporterName: string | null;
};

export async function fetchAuthorityReport(
  reportId: string
): Promise<AuthorityReportDetail> {
  const res = await fetch(`/api/civicai/authority/reports/${reportId}`);
  return parseApi<AuthorityReportDetail>(res);
}
