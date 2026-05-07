# Podcast Player Technical Test

Language: English | [Español](README.es.md)

Senior React technical test for a podcast player application based on the provided Figma design.

The application allows users to search real podcasts from the iTunes Search API, open a podcast detail screen, browse episodes, and control playback through a responsive audio player. The implementation focuses on production-oriented frontend architecture, visual fidelity, accessibility, testability, and maintainability.

Live demo:

[https://jorge-r-rodriguez.github.io/podcast-player-app/](https://jorge-r-rodriguez.github.io/podcast-player-app/)

## Project Scope

This project was built as a technical assessment, not as a basic demo. The main goal was to deliver a small but well-structured frontend application with clear architectural boundaries and a realistic user experience.

Implemented scope:

- Podcast search view.
- Podcast detail view.
- Real iTunes Search API integration.
- Responsive Figma-inspired dark podcast player UI.
- Search debounce.
- Search result pagination.
- Episode list with scrollable content.
- Play, pause, previous, next, repeat, shuffle, seek and volume controls.
- Synchronized playback state between episode rows and the bottom player.
- Mobile, tablet and desktop responsive behavior.
- Loading, error, empty and skeleton states.
- GitHub Pages deployment.
- CORS fallback strategy for iTunes on static hosting.
- Unit, component and E2E coverage.

## Technical Stack

- React
- TypeScript with strict mode
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

## Why Vite Instead of CRA

Although the original statement mentions create-react-app, this project uses Vite as a modern replacement due to better performance, faster development server, simpler configuration and current React ecosystem standards.

Vite also provides a clearer production build pipeline, strong TypeScript support, fast HMR, and a smaller configuration surface than legacy CRA setups.

## Architecture

The codebase follows a frontend-oriented Hexagonal Architecture with DDD principles and feature-based organization.

The objective is to keep business rules, API details, mapping logic, and framework-specific concerns separated from visual components. Components render UI state and delegate behavior to application hooks, use cases, repository contracts, and infrastructure adapters.

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

## Hexagonal Architecture

The domain layer defines the core entities, repository contracts and use cases. Infrastructure implements adapters for external systems, especially iTunes API access and CORS-safe request handling. Presentation depends on application hooks and domain-ready models, not on external API response shapes.

Main boundaries:

- Domain entities: normalized `Podcast`, `PodcastSearchResult` and `Episode` models.
- Repository contracts: ports consumed by use cases.
- Use cases: search podcasts and get podcast detail.
- Infrastructure API client: iTunes request handling.
- Infrastructure repository: iTunes-specific adapter.
- Mappers: conversion from iTunes payloads into domain models.
- Application hooks: React Query orchestration.
- Presentation components: accessible and responsive UI.

## DDD Frontend

The `podcasts` module is treated as a bounded context. Domain language is explicit in entities, use cases, repositories, and feature-specific UI components.

Visual components do not know about iTunes field names, Axios configuration, CORS handling, JSONP fallback, or React Query cache strategy.

## API Integration

The application consumes the iTunes Search API:

- Search podcasts: `https://itunes.apple.com/search?media=podcast&entity=podcast&term={query}`
- Podcast detail with episodes: `https://itunes.apple.com/lookup?id={collectionId}&entity=podcastEpisode`

API access is implemented in:

```txt
src/modules/podcasts/infrastructure/api/iTunesApiClient.ts
```

The iTunes API payload is isolated through mapper functions before reaching the domain and presentation layers.

## CORS Handling

GitHub Pages is a static host, and iTunes can return restrictive CORS headers for `github.io` origins. To keep the public demo functional, the infrastructure API client uses this strategy:

1. Try a standard HTTP request through Axios.
2. If the browser blocks the request due to CORS, fall back to iTunes JSONP support.
3. Keep optional AllOrigins configuration available through environment variables.

This behavior is encapsulated in the infrastructure layer. Components and hooks remain unaware of CORS details.

Environment variables:

```txt
VITE_ITUNES_API_BASE_URL=https://itunes.apple.com
VITE_CORS_PROXY_URL=https://api.allorigins.win/raw?url=
VITE_ENABLE_CORS_PROXY=false
```

## Routing and GitHub Pages

Local development uses Vite normally. The public GitHub Pages deployment uses a production build with the correct base path:

```txt
/podcast-player-app/
```

For static hosting compatibility, the deployed app uses hash routing on GitHub Pages:

```txt
https://jorge-r-rodriguez.github.io/podcast-player-app/#/podcasts
```

The deployment workflow builds the nested Vite app from the repository root and publishes the generated `dist` artifact through GitHub Actions.

## UI and Figma Fidelity

The interface is based on the provided Figma podcast player design:

- Dark mode UI.
- Minimal podcast/music player layout.
- Large podcast artwork on detail.
- Table-like episode and search rows.
- Bottom playback bar.
- Desktop, tablet and mobile adaptations.
- Scrollable lists to preserve player visibility.
- Icon-only controls with accessible labels.
- TailwindCSS for layout, spacing, responsive behavior and visual polish.
- Material UI used selectively for controls such as inputs, pagination, skeletons, tooltips and progress indicators.

## Accessibility

Accessibility considerations implemented:

- Semantic HTML structure.
- Real buttons and links for interactions.
- Associated labels for form controls.
- `aria-label` on icon-only player controls.
- `aria-live` for loading and error states.
- Visible focus states.
- Descriptive `alt` text for podcast artwork.
- Keyboard-friendly search, navigation and playback controls.
- No clickable `div` elements for primary actions.

## Performance

Performance decisions:

- Route-level lazy loading with `React.lazy`.
- Code splitting through Vite.
- React Query cache keys by search query and podcast ID.
- Configured `staleTime`, `gcTime`, retry behavior and disabled unnecessary focus refetch.
- Debounced search input.
- Memoized derived data for pagination, ordering and selected playback state.
- Isolated mappers and use cases to avoid UI-level data transformation.
- Avoided Redux because server state is handled by React Query and UI state is local.

## Testing Strategy

The project includes focused tests across architecture layers:

- Unit tests for podcast mappers.
- Unit tests for domain use cases.
- Unit tests for shared formatting utilities.
- Hook tests for debounced behavior.
- Component tests for `PodcastCard`, `PodcastSearchInput`, `EmptyState`, `ErrorState`, `EpisodeList`, and `PodcastPlayer`.
- Cypress E2E flow for search, detail navigation, playback controls, scroll behavior, mobile and tablet player layout.
- Optional live GitHub Pages E2E test for the real deployed route and iTunes data.

Run the normal test suite:

```bash
npm run test
npm run test:e2e
```

Run the live GitHub Pages verification:

```bash
npx cypress run --config baseUrl=https://jorge-r-rodriguez.github.io/podcast-player-app --env LIVE_PAGES=true --spec cypress/e2e/podcast-live-pages.cy.ts
```

## How to Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Local URL:

```txt
http://localhost:5173
```

## Available Scripts

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

## Deployment

The project is deployed to GitHub Pages using GitHub Actions.

Deployment branch:

```txt
technical-test/podcast-player-app
```

Public URL:

[https://jorge-r-rodriguez.github.io/podcast-player-app/](https://jorge-r-rodriguez.github.io/podcast-player-app/)

The workflow runs:

- Dependency installation.
- Lint.
- Unit tests.
- Production build for Pages.
- Artifact upload.
- GitHub Pages deployment.

## Future Improvements

- Persist recent searches.
- Add favorite podcasts.
- Add richer podcast feed parsing for metadata not exposed by iTunes.
- Add visual regression testing for the Figma-inspired UI.
- Add GitHub Actions checks for Cypress in a CI matrix.
- Improve audio error handling for podcast hosts that reject embedded playback.
