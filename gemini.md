# Project Constitution (gemini.md)

## 1. North Star
Dashboard Analítico Automatizado e Interactivo para consultar y analizar casos de negocio de Starter Story LATAM.

## 2. Data Schemas (JSON)

### Apify Webhook Payload (Input desde Scraper)
```json
{
  "youtube_video_id": "string",
  "title": "string",
  "description": "string",
  "transcript": "string",
  "views": "number",
  "likes": "number"
}
```

### LLM Processed Output (Intermediate to DB)
```json
{
  "industry": "string",
  "business_model": "string",
  "revenue": "number",
  "profit": "number",
  "margin": "number",
  "rpm_profile": "string",
  "proposed_solutions": ["string"]
}
```

## 3. Behavioral Rules
1. **Tolerancia Cero a Duplicados (Upsert Strict):** El sistema jamás debe crear dos registros para el mismo video. El webhook debe usar el `youtube_video_id` como llave única; si el video ya existe, solo actualiza las métricas, no duplica la transcripción.
2. **Asincronía Obligatoria:** El frontend nunca debe "quedarse esperando" a que el scraper termine. El flujo es: admin dispara el scraping -> Apify trabaja en segundo plano -> Apify avisa al Webhook -> El Webhook guarda en Supabase.
3. **Aislamiento de Privilegios:** La llave `service_role` de Supabase está estrictamente prohibida en el frontend. Solo puede vivir en la carpeta `/api/` (Serverless Functions) para garantizar que nadie pueda inyectar datos falsos desde el navegador.
4. **Límites de Procesamiento:** Filtrar en el webhook los videos que no tengan transcripción o que excedan una hora de duración para ahorrar tokens.

## 4. Architectural Invariants
- **Source of Truth:** Supabase (`videos`, `video_snapshots`, `scraping_logs`). Cualquier dato mostrado en el frontend debe venir exclusivamente de la base de datos.
- **Integrations:** Vercel (Hosting), Supabase (Base de datos), Apify (Scraper), OpenAI o Anthropic (LLM).
- **Delivery Payload:** Frontend Next.js. El Administrador usa `/admin/scraper`, y el usuario final consume los datos en la página de inicio `/`.
