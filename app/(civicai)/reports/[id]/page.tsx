import { notFound } from "next/navigation";

import { ReportView } from "@/components/civicai/report/report-view";
import { DEMO_REPORT } from "@/lib/civicai/data/reports";
import { mapDbReport } from "@/lib/civicai/map-db-report";
import { getServerUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: id === "demo" ? DEMO_REPORT.serviceName : "Report" };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "demo") {
    return <ReportView report={DEMO_REPORT} />;
  }

  const user = await getServerUser();
  if (!user) {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("citizen_reports")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const report = mapDbReport(data);
  return <ReportView report={report} />;
}
