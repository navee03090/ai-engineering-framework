import { DocumentUploadPanel } from "@/components/civicai/upload/document-upload";

export const metadata = {
  title: "Upload Evidence",
  description: "Upload waste photos or environmental notices for OCR analysis.",
};

export default function UploadPage() {
  return <DocumentUploadPanel />;
}
