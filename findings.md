# Findings and Research

## Discoveries
- **Apify Integration:** Based on research, `starvibe/youtube-video-transcript` accepts URL or Channel URL. `akash9078/youtube-transcript-extractor` takes `{ "videoUrl": "<url>" }`. Webhooks output JSON upon completion. We will set up a POST endpoint to catch Webhook data.
- **Database:** User requested real persistence. Supabase/PostgreSQL will be used for modeling the RPM, Pain Points, and AI Proposals tables.
- **Tech Stack Inference:** The prompt mandates Python scripts in `tools/` for execution logic. The web frontend can be Next.js, talking to a Python FastAPI backend or running Python scripts directly for the heavy lifting (or using Supabase edge functions/API integrations).

## Constraints
- **MVT Validation:** Must be human interactions (doc evidence required), zero fake data.
- **Execution Lock:** App restricts proposals until RPM Wizard is completed.
- No variables in memory or temporary JSON files.
