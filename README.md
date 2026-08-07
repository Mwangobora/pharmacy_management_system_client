# PharmaSys — Pharmacy Management System (Client)

React + TypeScript + Vite frontend for the Pharmacy Management System. Talks to the Django REST API in `../pharmacy_management_system`.

## Quick Start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and expects the backend API at the URL configured in `.env` (`VITE_API_BASE_URL`, default `http://0.0.0.0:8000`). Start the backend first — see `pharmacy_management_system/ReadMe.md`.

## Demo Login

The backend ships a seed command (`python manage.py seed_demo_data`) that loads realistic Tanzanian pharmacy data — 17 categories, 6 suppliers, 100 medicines with opening stock, and 4 demo accounts, one per role. Run it once against the backend, then log in at `/login` with any of:

| Role | Email | Password |
|---|---|---|
| System Administrator (full access) | `admin@pharmasys.co.tz` | `Admin@2026!` |
| Pharmacist (dispensing & sales) | `pharmacist@pharmasys.co.tz` | `Pharma@2026!` |
| Cashier (OTC sales & payments) | `cashier@pharmasys.co.tz` | `Cashier@2026!` |
| Inventory Manager (stock & procurement) | `storekeeper@pharmasys.co.tz` | `Store@2026!` |

These are demo-only credentials seeded for local/demo environments — rotate or remove them before any production deployment.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- TanStack Query for server state
- React Hook Form + Zod for forms/validation
- React Router

## Project Structure

- `src/pages/` — route-level pages
- `src/components/` — feature components, grouped by domain (`medicines/`, `purchases/`, `sales/`, `detail/` shared detail-view primitives, `forms/` shared form primitives, `ui/` shadcn primitives)
- `src/hooks/queries/` and `src/hooks/mutations/` — TanStack Query hooks per domain, talking to `src/api/*Api.ts`
- `src/api/` — typed HTTP clients per backend app
- `src/types/` — shared TypeScript types mirroring backend serializers

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
