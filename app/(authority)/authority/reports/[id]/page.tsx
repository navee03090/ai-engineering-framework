import { AuthorityReportView } from "@/components/civicai/authority/authority-report-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `Authority Report ${id.slice(0, 8)}` };
}

export default async function AuthorityReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AuthorityReportView reportId={id} />;
}
