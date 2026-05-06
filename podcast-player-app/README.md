# Podcast Player Technical Test

Mini React application for searching and listening to music podcasts using the iTunes Search API. The visual direction is based on the provided Figma community design and follows a dark, minimal podcast player interface.

This repository is being built incrementally with senior-level reviewability in mind: small commits, explicit boundaries, and architecture decisions documented as the implementation grows.

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

Vite also provides a clearer production build pipeline, first-class TypeScript support, fast HMR, and a smaller configuration surface than legacy CRA setups.

## Architecture

The application follows a frontend-oriented Hexagonal Architecture with DDD and feature-based organization.

The goal is to keep business rules and external API details outside visual components. UI components should render state and delegate application behavior to hooks, use cases, repositories, and infrastructure adapters.

```txt
src/
├── app/
│   ├── config/
│   ├── providers/
│   ├── router/
│   └── theme/
├── modules/
│   └── podcasts/
│       ├── domain/
│       │   ├── entities/
│       │   ├── repositories/
│       │   └── use-cases/
│       ├── infrastructure/
│       │   ├── api/
│       │   ├── mappers/
│       │   └── repositories/
│       ├── application/
│       │   ├── hooks/
│       │   └── services/
│       └── presentation/
│           ├── components/
│           ├── layouts/
│           └── pages/
├── shared/
│   ├── hooks/
│   ├── types/
│   ├── ui/
│   └── utils/
├── styles/
└── test/
```

## Hexagonal Architecture

The domain layer defines the core contracts and use cases. Infrastructure implements adapters for external systems such as iTunes and optional CORS proxy handling. Presentation depends on application hooks, not on API response shapes.

Planned boundaries:

- Domain entities: normalized `Podcast` and `Episode` models.
- Repository contracts: ports used by use cases.
- Infrastructure repositories: iTunes-specific adapters.
- Mappers: isolate external API payloads from domain models.
- Application hooks: React Query integration and UI-ready orchestration.
- Presentation components: accessible, responsive, reusable UI.

## DDD Frontend

The `podcasts` module is treated as a bounded context. Domain language is kept explicit through entities, use cases, repository contracts, and feature-specific presentation components.

Components should not know about iTunes field names, CORS proxy rules, Axios configuration, or cache strategy.

## API Integration

The application will use the iTunes Search API:

- Search podcasts: `https://itunes.apple.com/search?media=podcast&term={query}`
- Podcast lookup: `https://itunes.apple.com/lookup?id={collectionId}`

API access will be implemented in `src/modules/podcasts/infrastructure/api`.

## CORS Handling

CORS behavior is configurable through environment variables:

```txt
VITE_ITUNES_API_BASE_URL=https://itunes.apple.com
VITE_CORS_PROXY_URL=https://api.allorigins.win/raw?url=
VITE_ENABLE_CORS_PROXY=false
```

If browser CORS restrictions appear during integration, the AllOrigins proxy will be applied inside infrastructure only. Components and hooks will remain unaware of proxy details.

## UI Direction

The visual system is inspired by the Figma podcast player:

- Dark mode by default
- Minimal music player layout
- Strong content hierarchy
- Mobile-first responsive composition
- TailwindCSS for layout and visual utilities
- Material UI only for targeted controls such as inputs, pagination, skeletons, tooltips, progress indicators, and icon buttons

## How to Run Locally

```bash
npm install
npm run dev
```

The app runs on Vite's default local server:

```txt
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:watch
npm run test:e2e
npm run lint
npm run format
```

## Testing Strategy

Current baseline:

- Jest and React Testing Library are configured.
- Cypress is configured for E2E tests.
- A shell-level route render test is included.

Planned coverage:

- Unit tests for podcast mappers.
- Unit tests for domain use cases.
- Hook tests for debounced search behavior.
- Component tests for `PodcastCard`, `PodcastSearchInput`, `EmptyState`, and `ErrorState`.
- Cypress E2E flow: load app, search podcast, inspect results, open detail, return to list.

## Accessibility Considerations

Implementation standards:

- Semantic HTML.
- Real buttons and links for interaction.
- Associated labels for form controls.
- `aria-label` for icon-only controls.
- `aria-live` for loading and error states where useful.
- Visible focus states.
- Descriptive `alt` text for podcast artwork.
- Keyboard navigability for search, pagination, list items, and playback controls.

## Performance Decisions

Baseline decisions already in place:

- Route-level lazy loading with `React.lazy`.
- React Query provider configured with `staleTime`, `gcTime`, controlled retry, and disabled focus refetch.
- Feature modules prepared for code splitting and low coupling.

Planned decisions:

- Debounced search input to avoid unnecessary API calls.
- Memoized derived data for pagination.
- Stable callbacks for frequently rendered list items.
- React Query cache keys by query and podcast ID.
- Avoid business logic inside JSX.

## Screenshots

Screenshots will be added after the search and detail screens are implemented.

## Git Commit Convention

Use Conventional Commits with scopes:

```txt
chore(config): setup eslint and prettier
feat(search): add podcast search page
feat(detail): implement podcast detail screen
refactor(domain): separate repository contracts
test(search): add search hook unit tests
docs(readme): document architecture and setup
```

## Future Improvements

- Persist recent searches.
- Add optimistic UI for recently opened podcasts.
- Improve episode support if richer podcast feeds are integrated.
- Add visual regression snapshots for the Figma-inspired UI.
- Add CI pipeline for lint, unit tests, build, and Cypress.
