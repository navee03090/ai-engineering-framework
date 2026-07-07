import { AppError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";

export type AuthorityRequestItem = {
  id: string;
  query: string;
  language: string;
  detected_intent: string | null;
  service_slug: string | null;
  confidence: number | null;
  status: string;
  created_at: string;
  reporterEmail: string | null;
  reporterName: string | null;
  reportId: string | null;
};

export type AuthorityReportItem = {
  id: string;
  summary: string;
  service_slug: string | null;
  created_at: string;
  user_id: string;
  request_id: string | null;
  reporterEmail: string | null;
  reporterName: string | null;
};

async function loadProfileMap(userIds: string[]) {
  if (userIds.length === 0) {
    return new Map<string, { email: string; full_name: string | null }>();
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);

  if (error) {
    throw new AppError(error.message, 500, "PROFILE_LIST_FAILED");
  }

  return new Map(
    (data ?? []).map((profile) => [
      profile.id,
      { email: profile.email, full_name: profile.full_name },
    ])
  );
}

export const civicaiAuthorityService = {
  async getStats() {
    const admin = createAdminClient();

    const [requests, verifications, reports, citizens] = await Promise.all([
      admin.from("citizen_requests").select("id", { count: "exact", head: true }),
      admin
        .from("document_verifications")
        .select("id", { count: "exact", head: true }),
      admin.from("citizen_reports").select("id", { count: "exact", head: true }),
      admin.from("citizen_requests").select("user_id"),
    ]);

    const uniqueCitizens = new Set(
      (citizens.data ?? []).map((row) => row.user_id)
    ).size;

    const statusRows = await admin.from("citizen_requests").select("status");
    const byStatus: Record<string, number> = {};
    for (const row of statusRows.data ?? []) {
      byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
    }

    return {
      totalRequests: requests.count ?? 0,
      totalVerifications: verifications.count ?? 0,
      totalReports: reports.count ?? 0,
      uniqueCitizens,
      byStatus,
    };
  },

  async listRequests(limit = 50): Promise<AuthorityRequestItem[]> {
    const admin = createAdminClient();

    const { data: requests, error } = await admin
      .from("citizen_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new AppError(error.message, 500, "REQUEST_LIST_FAILED");
    }

    const rows = requests ?? [];
    const userIds = [...new Set(rows.map((row) => row.user_id))];
    const profileMap = await loadProfileMap(userIds);

    const requestIds = rows.map((row) => row.id);
    const reportMap = new Map<string, string>();

    if (requestIds.length > 0) {
      const { data: reports } = await admin
        .from("citizen_reports")
        .select("id, request_id")
        .in("request_id", requestIds);

      for (const report of reports ?? []) {
        if (report.request_id) {
          reportMap.set(report.request_id, report.id);
        }
      }
    }

    return rows.map((row) => {
      const profile = profileMap.get(row.user_id);
      return {
        id: row.id,
        query: row.query,
        language: row.language,
        detected_intent: row.detected_intent,
        service_slug: row.service_slug,
        confidence: row.confidence,
        status: row.status,
        created_at: row.created_at,
        reporterEmail: profile?.email ?? null,
        reporterName: profile?.full_name ?? null,
        reportId: reportMap.get(row.id) ?? null,
      };
    });
  },

  async listReports(limit = 50): Promise<AuthorityReportItem[]> {
    const admin = createAdminClient();

    const { data: reports, error } = await admin
      .from("citizen_reports")
      .select("id, summary, service_slug, created_at, user_id, request_id")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new AppError(error.message, 500, "REPORT_LIST_FAILED");
    }

    const rows = reports ?? [];
    const userIds = [...new Set(rows.map((row) => row.user_id))];
    const profileMap = await loadProfileMap(userIds);

    return rows.map((row) => {
      const profile = profileMap.get(row.user_id);
      return {
        id: row.id,
        summary: row.summary,
        service_slug: row.service_slug,
        created_at: row.created_at,
        user_id: row.user_id,
        request_id: row.request_id,
        reporterEmail: profile?.email ?? null,
        reporterName: profile?.full_name ?? null,
      };
    });
  },

  async getReportById(reportId: string) {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("citizen_reports")
      .select("*")
      .eq("id", reportId)
      .single();

    if (error || !data) {
      throw new AppError("Report not found", 404, "REPORT_NOT_FOUND");
    }

    const profileMap = await loadProfileMap([data.user_id]);
    const profile = profileMap.get(data.user_id);

    return {
      ...data,
      reporterEmail: profile?.email ?? null,
      reporterName: profile?.full_name ?? null,
    };
  },
};
