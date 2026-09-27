# Gym Management SaaS (`gym-saas`)

A modern, multi-tenant Gym Management SaaS platform built as a high-performance TypeScript monorepo using **Turborepo**, **Next.js 16**, **Tailwind CSS v4**, **shadcn/ui**, and **Biome**.

---

## 🏗️ Architecture & Project Structure

```text
gym-saas/
├── apps/
│   ├── web/               # Primary SaaS web application (Next.js 16 App Router)
│   └── docs/              # Platform documentation and API references (Next.js 16)
├── packages/
│   ├── ui/                # Centralized UI library (shadcn/ui, Radix UI, Tailwind v4)
│   ├── database/          # Shared database models & multi-tenant data layer (Prisma)
│   ├── typescript-config/ # Shared tsconfig bases across workspaces
│   └── eslint-config/     # Shared linting configs
├── .coderabbit.yml        # CodeRabbit AI automated code review configuration
├── .github/
│   ├── workflows/ci.yml   # GitHub Actions CI pipeline (Lint, Typecheck, Build)
│   └── dependabot.yml     # Automated weekly/monthly dependency updates
├── .husky/                # Git hooks (pre-commit lint & format validation)
├── biome.json             # Biome 2.5 linter and formatter configuration
├── pnpm-workspace.yaml    # Monorepo workspace configuration
└── turbo.json             # Turborepo task pipeline configuration
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Monorepo Engine**: [Turborepo](https://turbo.build/repo)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Primitives**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Linter & Formatter**: [Biome 2.5](https://biomejs.dev/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/)
- **CI/CD**: GitHub Actions
- **AI Code Review**: [CodeRabbit](https://coderabbit.ai/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `>= 24.0.0`
- **pnpm**: `>= 10.0.0`

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd gym-saas

# Install workspace dependencies
pnpm install
```

> [!NOTE]
> The `prepare` script automatically initializes Husky Git hooks upon running `pnpm install`.

### Development

Run all applications and packages concurrently in watch mode:

```bash
pnpm dev
```

To run a specific application:

```bash
# Run the web app only (http://localhost:3000)
pnpm dev --filter=web

# Run the docs app only (http://localhost:3001)
pnpm dev --filter=docs
```

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Starts all apps in development mode with Turbopack |
| `pnpm build` | Builds all applications and packages for production |
| `pnpm lint` | Runs Biome to check linting and formatting across the repo |
| `pnpm lint:fix` | Automatically fixes safe lint issues and formats all files |
| `pnpm lint:staged` | Validates only git-staged files (executed by Git pre-commit hook) |
| `pnpm format` | Formats all files with Biome |
| `pnpm check-types` | Type-checks all TypeScript packages via `turbo run check-types` |

---

## 🎨 UI Components & shadcn/ui

Components are centralized in [`packages/ui`](packages/ui) and shared across all applications.

### Adding a new shadcn component

To install a new component into the shared UI library:

```bash
pnpm dlx shadcn@latest add <component-name> -c packages/ui --yes
```

*Example:*

```bash
pnpm dlx shadcn@latest add dialog -c packages/ui --yes
pnpm dlx shadcn@latest add dropdown-menu -c packages/ui --yes
```

### Consuming Components

Import components in your apps via the `@repo/ui` workspace package:

```tsx
import { Button } from '@repo/ui/components/ui/button';

export default function MyPage() {
  return <Button variant="default">Save Changes</Button>;
}
```

---

## 🛡️ Code Quality & CI/CD

- **Pre-Commit Hook**: Husky runs `pnpm lint:staged` before any commit is created. Commits are blocked if formatting or lint checks fail.
- **GitHub Actions CI**:
  - `lint`: Validates Biome formatting and rules.
  - `typecheck`: Runs `turbo run check-types` across all workspaces.
  - `build`: Builds production artifacts with Turborepo caching.
- **CodeRabbit AI**: Automated pull request review verifying architectural invariants, multi-tenancy boundaries, and atomic database transactions.

---

## 📄 License

Private repository. All rights reserved.
