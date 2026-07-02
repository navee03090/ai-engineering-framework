"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PAKISTAN_DISTRICTS } from "@/lib/civic/config";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/validations/uploads";

type ReportFormProps = {
  titleLabel: string;
  descriptionPlaceholder: string;
  taglineUrdu: string;
};

export function CivicReportForm({
  titleLabel,
  descriptionPlaceholder,
  taglineUrdu,
}: ReportFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [district, setDistrict] = useState<string>(PAKISTAN_DISTRICTS[0]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("location", district);

    const file = fileRef.current?.files?.[0];
    if (file) {
      if (file.size > MAX_UPLOAD_BYTES) {
        toast.error("Evidence file exceeds 10 MB.");
        setIsSubmitting(false);
        return;
      }
      if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
        toast.error("Evidence file type not allowed.");
        setIsSubmitting(false);
        return;
      }
      formData.set("evidence", file);
    }

    try {
      const response = await fetch("/api/civic/report", {
        method: "POST",
        body: formData,
      });
      const body = await response.json();

      if (!response.ok || !body.success) {
        throw new Error(body.error?.message ?? "Report submission failed");
      }

      toast.success("Civic report submitted");
      router.push(`/command/${body.data.incident.id}?new=1`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Submission failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Public intake</Badge>
        </div>
        <CardTitle>Submit civic report</CardTitle>
        <CardDescription>{taglineUrdu}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">{titleLabel}</Label>
            <Input
              id="title"
              name="title"
              required
              minLength={3}
              placeholder="Flash flood blocking GT Road near Mingora"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District / city</Label>
            <Select
              value={district}
              onValueChange={(value) => setDistrict(value ?? PAKISTAN_DISTRICTS[0])}
            >
              <SelectTrigger id="district">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {PAKISTAN_DISTRICTS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Details</Label>
            <Textarea
              id="description"
              name="description"
              required
              minLength={10}
              rows={5}
              placeholder={descriptionPlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evidence">Photo evidence (optional)</Label>
            <Input
              ref={fileRef}
              id="evidence"
              type="file"
              accept={ALLOWED_MIME_TYPES.join(",")}
            />
            <p className="text-xs text-muted-foreground">Images or PDF up to 10 MB.</p>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Submitting…" : "Submit report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
