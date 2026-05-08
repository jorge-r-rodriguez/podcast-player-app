# Prueba Tecnica Podcast Player

Idioma: [English](README.md) | Español

Prueba tecnica senior en React para una aplicacion de reproductor de podcasts basada en el diseno provisto en Figma.

La aplicacion permite buscar podcasts reales desde la iTunes Search API, abrir el detalle de un podcast, navegar episodios y controlar la reproduccion desde un reproductor responsive. La implementacion prioriza arquitectura frontend orientada a produccion, fidelidad visual, accesibilidad, testing y mantenibilidad.

Demo publicada:

[https://jorge-r-rodriguez.github.io/podcast-player-app/](https://jorge-r-rodriguez.github.io/podcast-player-app/)

## Alcance Del Proyecto

Este proyecto fue construido como una prueba tecnica, no como una demo basica. El objetivo principal fue entregar una aplicacion pequena pero bien estructurada, con limites arquitectonicos claros y una experiencia de uso realista.

Alcance implementado:

- Vista de busqueda de podcasts.
- Vista de detalle de podcast.
- Integracion real con iTunes Search API.
- UI dark responsive inspirada en el diseno de Figma.
- Busqueda con debounce.
- Paginacion de resultados.
- Lista de episodios con scroll.
- Controles de play, pause, anterior, siguiente, repeat, shuffle, seek y volumen.
- Estado de reproduccion sincronizado entre las filas de episodios y el reproductor inferior.
- Adaptacion responsive para mobile, tablet y desktop.
- Estados de loading, error, empty y skeleton.
- Deploy en GitHub Pages.
- Estrategia de fallback CORS para iTunes en hosting estatico.
- Cobertura con tests unitarios, de componentes y E2E.

## Stack Tecnico

- React
- TypeScript con strict mode
- Vite
- React Router DOM
- TailwindCSS
- Material UI
- Axios
- TanStack React Query
- Jest
- React Testing Library
- Cypress
- ESLint
- Prettier

## Por Que Vite En Lugar De CRA

Aunque el enunciado original menciona create-react-app, este proyecto usa Vite como reemplazo moderno por su mejor performance, servidor de desarrollo mas rapido, configuracion mas simple y alineacion con los estandares actuales del ecosistema React.

Vite tambien ofrece un pipeline de build mas claro, buen soporte para TypeScript, HMR rapido y una superficie de configuracion mas simple que los setups legacy basados en CRA.

## Por Que Vite En Lugar De Webpack

El documento de guia menciona Webpack como punto a considerar. Este proyecto usa Vite porque actualmente es una herramienta de build productiva y estandar dentro del ecosistema React, con una experiencia de desarrollo mas simple y rapida para este tipo de SPA.

Vite igualmente genera un bundle de produccion optimizado y assets con code splitting, reduciendo configuracion manual que seria necesaria en un setup custom de Webpack. La decision queda documentada de forma explicita porque la prueba tecnica valora el criterio arquitectonico y de tooling utilizado.

## Arquitectura

El codigo sigue una arquitectura hexagonal orientada al frontend, con principios de DDD y organizacion por feature.

El objetivo es mantener separadas las reglas de negocio, los detalles de API, la logica de mapeo y las dependencias de framework respecto de los componentes visuales. Los componentes renderizan estado de UI y delegan comportamiento a hooks de aplicacion, casos de uso, contratos de repositorio y adaptadores de infraestructura.

```txt
src/
|-- app/
|   |-- config/
|   |-- providers/
|   |-- router/
|   `-- theme/
|-- modules/
|   `-- podcasts/
|       |-- domain/
|       |   |-- entities/
|       |   |-- repositories/
|       |   `-- use-cases/
|       |-- infrastructure/
|       |   |-- api/
|       |   |-- mappers/
|       |   `-- repositories/
|       |-- application/
|       |   |-- hooks/
|       |   `-- services/
|       `-- presentation/
|           |-- components/
|           |-- layouts/
|           `-- pages/
|-- shared/
|   |-- hooks/
|   |-- types/
|   |-- ui/
|   `-- utils/
|-- styles/
`-- test/
```

## Arquitectura Hexagonal

La capa de dominio define entidades, contratos de repositorio y casos de uso. Infraestructura implementa adaptadores para sistemas externos, especialmente acceso a iTunes API y manejo seguro de requests ante CORS. Presentacion depende de hooks de aplicacion y modelos normalizados, no de la forma de respuesta de APIs externas.

Limites principales:

- Entidades de dominio: modelos normalizados `Podcast`, `PodcastSearchResult` y `Episode`.
- Contratos de repositorio: puertos consumidos por casos de uso.
- Casos de uso: busqueda de podcasts y obtencion de detalle.
- API client de infraestructura: manejo de requests a iTunes.
- Repositorio de infraestructura: adaptador especifico de iTunes.
- Mappers: conversion de payloads de iTunes a modelos de dominio.
- Hooks de aplicacion: orquestacion con React Query.
- Componentes de presentacion: UI accesible y responsive.

## DDD Frontend

El modulo `podcasts` funciona como bounded context. El lenguaje de dominio esta representado en entidades, casos de uso, repositorios y componentes especificos de la feature.

Los componentes visuales no conocen nombres de campos de iTunes, configuracion de Axios, manejo de CORS, fallback JSONP ni estrategia de cache de React Query.

## Integracion Con API

La aplicacion consume la iTunes Search API:

- Buscar podcasts: `https://itunes.apple.com/search?media=podcast&entity=podcast&term={query}`
- Detalle con episodios: `https://itunes.apple.com/lookup?id={collectionId}&entity=podcastEpisode`

El acceso a API esta implementado en:

```txt
src/modules/podcasts/infrastructure/api/iTunesApiClient.ts
```

El payload de iTunes queda aislado mediante funciones mapper antes de llegar al dominio y a la capa de presentacion.

## Manejo De CORS

GitHub Pages es un hosting estatico, e iTunes puede devolver headers CORS restrictivos para origenes `github.io`. Para mantener funcional la demo publica, el cliente de infraestructura usa esta estrategia:

1. Intenta un request HTTP estandar con Axios.
2. Si el navegador bloquea el request por CORS, usa el soporte JSONP de iTunes como fallback.
3. Mantiene disponible la configuracion opcional de AllOrigins mediante variables de entorno.

Este comportamiento esta encapsulado en infraestructura. Los componentes y hooks no conocen detalles de CORS.

Variables de entorno:

```txt
VITE_ITUNES_API_BASE_URL=https://itunes.apple.com
VITE_CORS_PROXY_URL=https://api.allorigins.win/raw?url=
VITE_ENABLE_CORS_PROXY=false
```

## Routing Y GitHub Pages

El desarrollo local usa Vite normalmente. El deploy publico en GitHub Pages usa un build de produccion con el base path correcto:

```txt
/podcast-player-app/
```

Por compatibilidad con hosting estatico, la version desplegada usa hash routing:

```txt
https://jorge-r-rodriguez.github.io/podcast-player-app/#/podcasts
```

El workflow de deploy construye la app Vite anidada desde la raiz del repositorio y publica el artefacto `dist` mediante GitHub Actions.

## UI Y Fidelidad Al Figma

La interfaz esta basada en el diseno de reproductor de podcasts provisto en Figma:

- UI dark mode.
- Layout minimalista tipo podcast/music player.
- Artwork grande en detalle.
- Filas de busqueda y episodios con estilo de tabla.
- Reproductor inferior.
- Adaptaciones para desktop, tablet y mobile.
- Listados con scroll para preservar la visibilidad del player.
- Controles por iconos con labels accesibles.
- TailwindCSS para layout, espaciado, responsive y pulido visual.
- Material UI usado de forma puntual para inputs, paginacion, skeletons, tooltips e indicadores.

## Accesibilidad

Consideraciones implementadas:

- HTML semantico.
- Botones y enlaces reales para interacciones.
- Labels asociados a controles de formulario.
- `aria-label` en controles de player basados en iconos.
- `aria-live` para estados de loading y error.
- Estados de focus visibles.
- Texto `alt` descriptivo para artwork de podcasts.
- Busqueda, navegacion y controles de reproduccion usables con teclado.
- Sin `div` clickeables para acciones principales.

## Performance

Decisiones de performance:

- Lazy loading de rutas con `React.lazy`.
- Code splitting mediante Vite.
- Cache keys de React Query por termino de busqueda y podcast ID.
- Configuracion de `staleTime`, `gcTime`, retries y refetch controlado.
- Input de busqueda con debounce.
- Datos derivados memoizados para paginacion, ordenamiento y estado de reproduccion.
- Mappers y casos de uso aislados para evitar transformaciones de datos en UI.
- Sin Redux, porque el server state se maneja con React Query y el estado de UI es local.

## Estrategia De Testing

El proyecto incluye tests enfocados en distintas capas:

- Tests unitarios para mappers de podcasts.
- Tests unitarios para casos de uso de dominio.
- Tests unitarios para utilidades compartidas de formateo.
- Tests de hooks para comportamiento debounced.
- Tests de componentes para `PodcastCard`, `PodcastSearchInput`, `EmptyState`, `ErrorState`, `EpisodeList` y `PodcastPlayer`.
- Cypress E2E para busqueda, navegacion a detalle, controles de playback, scroll, mobile y layout en tablet.
- Test E2E opcional contra GitHub Pages real usando datos reales de iTunes.

Ejecutar la suite normal:

```bash
npm run test
npm run test:e2e
```

Ejecutar la verificacion live contra GitHub Pages:

```bash
npx cypress run --config baseUrl=https://jorge-r-rodriguez.github.io/podcast-player-app --env LIVE_PAGES=true --spec cypress/e2e/podcast-live-pages.cy.ts
```

## Como Ejecutar Localmente

Instalar dependencias:

```bash
npm install
```

Levantar el servidor de desarrollo:

```bash
npm run dev
```

URL local:

```txt
http://localhost:5173
```

## Scripts Disponibles

```bash
npm run dev
npm run build
npm run build:pages
npm run preview
npm run test
npm run test:watch
npm run test:e2e
npm run lint
npm run format
```

## Deploy

El proyecto esta desplegado en GitHub Pages mediante GitHub Actions.

Branch de deploy:

```txt
technical-test/podcast-player-app
```

URL publica:

[https://jorge-r-rodriguez.github.io/podcast-player-app/](https://jorge-r-rodriguez.github.io/podcast-player-app/)

El workflow ejecuta:

- Instalacion de dependencias.
- Lint.
- Tests unitarios.
- Build de produccion para Pages.
- Upload del artefacto.
- Deploy en GitHub Pages.

## Mejoras Futuras

- Persistir busquedas recientes.
- Agregar favoritos.
- Integrar parsing de feeds para metadata no expuesta por iTunes.
- Agregar visual regression testing para la UI inspirada en Figma.
- Agregar checks de Cypress en una matriz de CI.
- Mejorar el manejo de errores de audio para hosts que rechazan reproduccion embebida.
