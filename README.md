# Starter Story LATAM Intelligence Engine

Un Dashboard Analítico Automatizado e Interactivo construido para consultar, analizar y clasificar casos de negocio (videos) de Starter Story orientados al mercado de LATAM.

Este proyecto actúa como un motor de Business Intelligence que raspa contenido, extrae transcripciones, perfila modelos de negocio y cruza oportunidades con los *Pain Points* (puntos de dolor) de Latinoamérica.

## 🚀 Estado Actual del Proyecto (Fase 1 Completada)

Actualmente la **Fase 1 (Scraping Asíncrono y Base de Datos)** se encuentra totalmente implementada y operativa en producción:

- **UI/UX Dark Mode:** Diseño premium responsivo y dinámico (inspirado en Shadcn/UI) construido con **Tailwind CSS v4** y **Next.js (App Router)**.
- **Scraper Asíncrono Integrado:** Integración completa con **Apify**. El administrador puede ingresar un enlace de YouTube desde el panel; esto dispara un actor en segundo plano sin congelar la aplicación.
- **Webhook Inteligente:** Un endpoint estricto (`/api/webhooks/apify`) recibe los datos de Apify al terminar, extrae el ID real de YouTube mediante expresiones regulares y ensambla la transcripción y el título.
- **Persistencia en Supabase:** El webhook hace un *Upsert* (tolerancia cero a duplicados) directo a la base de datos Supabase eludiendo los RLS gracias al Service Role Key.
- **Dashboard Reactivo:** La página de inicio lee el total de videos y la última fecha de ejecución en tiempo real desde Supabase, con un botón sutil para refrescar datos manualmente.
- **Explorador de Videos:** Una página dedicada (`/videos`) con una tabla de los videos extraídos, enlaces funcionales al origen en YouTube y filtrado local instantáneo por título.
- **Logs de Scraper:** Una interfaz (`/scraper-logs`) para revisar visualmente cada ejecución del scraper, su estado (SUCCESS/FAILED/RUNNING) gracias a "badges" y la cantidad de videos logrados por tanda.

## 🧩 Arquitectura / Stack Tecnológico

- **Frontend:** Next.js (React), Tailwind CSS v4, Lucide Icons.
- **Backend/API:** Serverless Functions de Next.js.
- **Base de Datos:** Supabase (PostgreSQL).
- **Extracción de Datos:** Apify Client (YouTube Scraper).
- **Despliegue:** Vercel (CI/CD Automático).

## 🗺️ Roadmap de Próximas Fases (Pendientes)

1. **Fase 2 - Clasificación con IA:** Envío automático de las transcripciones a un LLM (Anthropic Claude u OpenAI) para extraer Industria, Modelo de Negocio, Márgenes, etc.
2. **Fase 3 - Pain Points LATAM & Wizard RPM:** Cruzar los modelos extraídos con problemas del mercado latino y generar perfiles Results-Purpose-Massive Action.
3. **Fase 4 - Motor de Soluciones:** Algoritmo para proponer integraciones tecnológicas precisas a esos negocios.

## 🛠️ Instalación y Ejecución Local

Para levantar el entorno de desarrollo en tu máquina:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno:**
   Debes crear un archivo `.env.local` en la raíz del proyecto con tus credenciales:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   APIFY_API_TOKEN=tu_token_apify
   ```

3. **Levantar el servidor local:**
   ```bash
   npm run dev
   ```

El servidor estará disponible y escuchando peticiones en `http://localhost:3000`.
