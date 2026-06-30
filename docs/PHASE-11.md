# Phase 11 — File Upload & Storage

**Status:** Complete  
**Version:** AEF v1.0

## Goal

Upload incident evidence (images, PDFs, audio, documents) to Supabase Storage with validation, signed URLs, and incident attachment metadata.

## Delivered

| Area | Implementation |
|------|----------------|
| Storage service | Upload, list, signed URL, delete (`storage.service.ts`) |
| Attachment service | Link files to incidents (`attachment.service.ts`) |
| Migration | `00003_incident_attachments.sql` |
| API | `POST/GET/DELETE /api/uploads` |
| API | `GET/POST /api/incidents/[id]/attachments` |
| UI | `/uploads` page + `FileUpload` component |
| Validation | MIME allowlist, 10 MB max (`lib/validations/uploads.ts`) |

## Allowed file types

- **Images:** jpeg, png, webp, gif
- **PDF:** application/pdf
- **Audio:** mpeg, wav, webm, mp4
- **Documents:** plain text, Word (doc/docx)

Max size: **10 MB**

## API examples

```bash
# Upload (multipart, authenticated)
curl -X POST http://localhost:3000/api/uploads \
  -H "Cookie: <session>" \
  -F "file=@photo.jpg" \
  -F "folder=incidents"

# List files in folder
curl "http://localhost:3000/api/uploads?folder=incidents" \
  -H "Cookie: <session>"

# Signed URL
curl "http://localhost:3000/api/uploads?path=user-id/incidents/123-file.jpg" \
  -H "Cookie: <session>"

# Attach to incident
curl -X POST http://localhost:3000/api/incidents/<id>/attachments \
  -H "Content-Type: application/json" \
  -H "Cookie: <session>" \
  -d '{
    "storagePath": "user-id/incidents/123-photo.jpg",
    "fileName": "photo.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 102400
  }'
```

## Supabase setup

1. Run `supabase/migrations/00003_incident_attachments.sql`
2. Confirm `uploads` bucket exists (from `00001_init.sql`)
3. Bucket is **private** — access via signed URLs only

## UI

- Protected page: `/uploads`
- Dashboard link: **Open uploads**
- Use `FileUpload` in v0-imported incident forms

## Verification

```bash
npm run lint
npm run test
npm run build
```

## Next phase

**Phase 12 — Email & Notifications:** production Resend templates and incident alert flows.
