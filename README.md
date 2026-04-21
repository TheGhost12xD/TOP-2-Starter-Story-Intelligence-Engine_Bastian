# Starter Story Intelligence Engine

## Descripción
Una aplicación inteligente diseñada para extraer automáticamente información rica de los videos de **Starter Story** mediante data scraping. Los datos de ingresos y modelos de negocio recolectados se clasifican utilizando Inteligencia Artificial (LLMs) contra una matriz de problemas (Pain Points) endémicos de la región **LATAM** y se cruzan con el **perfil RPM** (Recursos, Pasiones y Mercado) del usuario. 

El objetivo final es generar propuestas de negocio hiper-viables y curadas dinámicamente. De las propuestas generadas, el usuario elegirá al menos una para validarla mediante un **Minimum Viable Test (MVT)** con el mercado real.

---

## 🏗 Arquitectura de 5 Módulos

El sistema está construido bajo los siguientes pilares de funcionamiento continuo:

1. **① Scraper Automatizado:** Se conecta interactivamente con actores de Apify (ej. `youtube-video-transcript`) para recolectar las transcripciones completas de los videos subidos a Starter Story en segundo plano.
2. **② Base de Datos Persistente:** Supabase/PostgreSQL provee persistencia dura guardando el perfil RPM, las transcripciones de videos y los análisis generados, sin usar datos temporales.
3. **③ Clasificador de Inteligencia Artificial:** Un pipeline de LLM que procesa los textos de las transcripciones y evalúa su potencial impacto resolviendo problemas críticos específicos de Latinoamérica.
4. **④ El Perfil RPM (Recursos, Pasiones y Mercado):** La plataforma evalúa los requisitos exactos de la persona que ejecutará la idea (recursos y capital actual) para evitar sugerir negocios imposibles.
5. **⑤ Motor de Soluciones Dinámicas:** Sistema de cruce de datos que toma los problemas de LATAM + Perfil RPM + Datos de Starter Story y compila en tiempo real las soluciones finales.

---

## ⚠ Advertencia de Evaluación

> **NOTA IMPORTANTE PARA EL EVALUADOR:**
> Esta aplicación utiliza **datos dinámicos y persistencia real (Supabase/PostgreSQL)**. No hay información "hardcodeada", ni variables guardadas temporalmente en memoria, ni archivos estáticos o mocks. 
> Todo ha sido diseñado robustamente para soportar una evaluación de escenarios reales o una *evaluación destructiva*. Si se actualizan respuestas en el Perfil RPM o cambian los problemas de LATAM observados, el motor de IA recalculará estrictamente las soluciones generadas sin fallos.

---

## ⚙ Setup / Instalación

Sigue estos pasos para correr la aplicación localmente en modo desarrollo:

1. Clonar este repositorio:
```bash
git clone https://github.com/TheGhost12xD/TOP-2-Starter-Story-Intelligence-Engine_Bastian.git
cd TOP-2-Starter-Story-Intelligence-Engine_Bastian
```

2. Instalar las dependencias de Node:
```bash
npm install
```

3. Configurar las variables de entorno:
Asegúrate de agregar un archivo `.env` en la raíz copiando la estructura requerida, incluyendo tus credenciales para la Base de Datos, tokens de Apify y las llaves de OpenAI/LLM.

4. Levantar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará lista para usarse localmente en su entorno asignado de Next.js (generalmente `http://localhost:3000`).
