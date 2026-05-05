# Starter Story LATAM Analyzer

El propósito de este proyecto es construir un sistema de inteligencia que analiza las historias de Starter Story enfocadas en el mercado latinoamericano. Automatizamos la recolección, clasificación y perfilamiento de negocios para generar estrategias.

## Módulos Obligatorios

Nuestra arquitectura se compone de 5 módulos principales:
1. **① Scraper**: Extrae información de historias de negocios en Starter Story.
2. **② Base de datos**: Almacenamiento estructurado y persistente de la información recolectada.
3. **③ Clasificador**: Categoriza los negocios según su industria, tamaño y modelo.
4. **④ Perfil RPM**: Genera perfiles basados en Revenue, Profit y Model.
5. **⑤ Motor de soluciones**: Analiza las necesidades y propone soluciones tecnológicas o estratégicas.

## Instalación y Ejecución

Para comenzar a desarrollar en este proyecto, sigue estos pasos:

1. Instalar las dependencias:
   ```bash
   npm install
   ```

2. Levantar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```

El servidor estará disponible en `http://localhost:3000`.
