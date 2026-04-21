# Project Constitution (gemini.md)

## Data Schemas
### Input Schema
- **RPM Profile:** User's Skills, Passions, Resources, Market focus.
- **LATAM Pain Points:** Domain/Region specific problems dataset.
- **Apify Webhook Payload (starvibe/youtube-video-transcript or akash9078/youtube-transcript-extractor):**
  - Triggered after scraper completion.
  - Payload contains `videoUrl` or video metadata and full transcript text.

### Output Schema (Payload)
- **Processed Video Document:** Raw video metadata (URL, Title), Transcript, AI Analysis (Alignment with LATAM Pain Points & RPM).
- **Business Proposal Document:** 
  - `Title`: Proposed idea title.
  - `Description`: Summary of the business.
  - `RPM_Alignment`: How it fits the user profile.
  - `Target_Pain_Point`: Which LATAM problem it solves.
  - `Action_Steps`: How to validate via MVT.

## Behavioral Rules
1. **Zero Static Data:** Engine must be dynamic. AI re-calculates proposals if RPM profile or pain points change.
2. **Incremental Automation:** Scraper runs on a background schedule, only parsing *new* channel videos.
3. **Solution Lock:** No proposals generated until the user completes the mandatory first RPM Wizard run.
4. **Honest Validation:** MVT requires >= 5 real human interactions, documented. Falsified data will fail the project.

## Architectural Invariants
- **Layer 1 (Architecture):** Technical SOPs in Markdown defining goals, inputs, tools, and edge cases. Logic changes require SOP updates first.
- **Layer 2 (Navigation):** Reasoning layer to route data.
- **Layer 3 (Tools):** Deterministic Python scripts in `tools/`.
- **Database:** Supabase/PostgreSQL (real persistence, no temporary JSON).
- Tokens/Secrets stay in `.env`.
- Ephemeral/Intermediate data stays in `.tmp/`.
- The 'Data-First' Rule: Tools cannot be built until Data Schema is defined.
- Self-Annealing: Errors lead to analyzing, patching, testing, and updating architecture docs.
