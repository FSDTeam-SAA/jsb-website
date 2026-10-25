# ByteSpace Frontend

A responsive learning-platform interface built as a frontend assessment. It presents a marketing home page, a static course catalogue, and sign-in/sign-up screens. The project is currently **UI-only**: it has no API routes, database, authentication service, or environment variables.

## Contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Get started](#get-started)
- [Available commands](#available-commands)
- [Routes and current behaviour](#routes-and-current-behaviour)
- [Project structure](#project-structure)
- [Where to make changes](#where-to-make-changes)
- [Assets, styling, and accessibility](#assets-styling-and-accessibility)
- [Known frontend-only links](#known-frontend-only-links)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 18, Tailwind CSS 3, Base UI primitives |
| Animation and interaction | Framer Motion, Lenis smooth scrolling, `react-scroll-to-top` |
| Icons | Lucide React and React Icons |
| Package manager | npm (a `package-lock.json` is committed) |

## Prerequisites

Install the following before starting:

- Git
- Node.js **18.17 or later** (Node 20 LTS is recommended)
- npm (included with Node.js)

No `.env` file or external service setup is needed for the current version.

## Get started

Clone the repository and use the lockfile to install the exact dependency tree:

```bash
git clone git@github.com:Kongkon-79/bytespace-new-frontend-assessment.git
cd bytespace-new-frontend-assessment
npm ci
```

Start the development server:

```bash
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000). Next.js watches the source files and refreshes the page during development.

If you do not have SSH access to GitHub, clone over HTTPS instead:

```bash
git clone https://github.com/Kongkon-79/bytespace-new-frontend-assessment.git
```

## Available commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the locked dependencies; preferred for a fresh clone or CI. |
| `npm install` | Install dependencies and update the lockfile only when dependencies change. |
| `npm run dev` | Run the local development server, normally at port 3000. |
| `npm run lint` | Run the configured Next.js/ESLint checks. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build; run `npm run build` first. |

To test the production build locally:

```bash
npm run build
npm run start
```

If port 3000 is already in use, choose another port:

```bash
npm run dev -- -p 3001
```

## Routes and current behaviour

| URL | Source | What it contains |
| --- | --- | --- |
| `/` | `src/app/(website)/page.tsx` | Hero, trusted-company marquee, category filters, course cards, learning paths, promotional sections, testimonials, navigation, and footer. |
| `/login` | `src/app/(auth)/login/page.tsx` | Sign-in form UI and social-sign-in buttons. |
| `/sign-up` | `src/app/(auth)/sign-up/page.tsx` | Account-creation form UI. |
| any unknown URL | `src/app/not-found.tsx` | Custom 404 page. |

The `(website)` and `(auth)` folders are [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups); their names do not appear in the URLs.

The root layout also provides local fonts, smooth scrolling, a scroll-to-top control, loading UI, and route/global error boundaries.

## Project structure

```text
.
├── public/images/                 # Static images, logos, illustrations, and course artwork
├── src/
│   ├── app/
│   │   ├── (website)/             # Public site layout, home page, and its sections
│   │   ├── (auth)/                # Login/sign-up pages and shared auth showcase
│   │   ├── _data/courses.json     # Demo course records shown on the homepage
│   │   ├── fonts/                 # Local Satoshi and Poppins font files
│   │   ├── globals.css            # Tailwind layers, design tokens, and global styles
│   │   ├── layout.tsx             # Root layout, metadata, fonts, global providers
│   │   ├── loading.tsx            # Route loading UI
│   │   ├── error.tsx              # Route-level error UI
│   │   ├── global-error.tsx       # Application-level error UI
│   │   └── not-found.tsx          # 404 UI
│   ├── components/
│   │   ├── providers/             # Smooth scrolling and scroll-to-top providers
│   │   ├── shared/                # Shared Navbar and Footer
│   │   └── ui/                    # Reusable Button, Input, Select, etc.
│   └── lib/utils.ts               # Shared class-name helper
├── components.json                # shadcn-style component configuration and aliases
├── tailwind.config.ts             # Tailwind theme extensions and content paths
├── next.config.mjs                # Next.js configuration
├── tsconfig.json                  # TypeScript options and `@/*` alias
└── package.json                   # Scripts and dependencies
```

## Where to make changes

### Page content and course data

- Edit homepage section order in `src/app/(website)/page.tsx`.
- Edit a particular homepage section in `src/app/(website)/_components/`.
- Add or change sample courses in `src/app/_data/courses.json`. Keep the fields aligned with the `Course` type in `course-card.tsx`.
- Change login and sign-up form presentation in `src/app/(auth)/login/_components/` and `src/app/(auth)/sign-up/_components/`.

### Shared UI and branding

- Navigation: `src/components/shared/Navbar/Navbar.tsx`
- Footer: `src/components/shared/Footer/Footer.tsx`
- Reusable UI primitives: `src/components/ui/`
- Images: add them below `public/images/`, then reference them from the site as `/images/...`.
- Fonts: local font definitions are in `src/app/layout.tsx`; font files are in `src/app/fonts/`.

### Styling

Use Tailwind utility classes for component-level styles. The global stylesheet defines the shared primary (lime) and secondary (blue) CSS tokens plus site-wide utilities. Tailwind theme extensions, including custom fonts, container sizes, colors, and animations, are in `tailwind.config.ts`.

Imports beginning with `@/` use the TypeScript alias for `src/`; for example, `@/components/ui/button` resolves to `src/components/ui/button`.

## Assets, styling, and accessibility

- Use `next/image` for local images, as the existing components do.
- Keep informative image `alt` text meaningful; use `alt=""` only for decorative images.
- Interactive controls should retain visible keyboard focus and accessible labels.
- The trusted-company marquee honors `prefers-reduced-motion`; new motion should provide a comparable fallback.
- Do not remove the local font files without also updating `src/app/layout.tsx`.

## Known frontend-only links

This repository is intentionally a visual frontend and some controls are placeholders. They should be connected to real routes/services before a production launch:

- Sign-in, account-creation, social-sign-in, and newsletter forms have no submission or authentication logic.
- The hero search targets `/courses`, while the navbar and cards also reference `/courses`, `/courses/[id]`, `/creators`, and `/cart`; those pages are not implemented in this repository.
- Footer and legal links use `#` placeholders.
- Course records are local JSON rather than data returned from a backend.

## Deployment

Any host that supports Next.js can deploy this app. A typical Node-host deployment is:

```bash
npm ci
npm run build
npm run start
```

Set the host's Node.js version to 18.17+ and expose the port expected by the platform. No runtime environment variables are currently required.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm ci` fails because the lockfile and package manifest differ | Use the committed `package-lock.json`; if you intentionally changed dependencies, run `npm install` and commit the resulting lockfile. |
| `next: command not found` | Run `npm ci` (or `npm install`) from the repository root. |
| Port 3000 is already occupied | Start with `npm run dev -- -p 3001`. |
| A new image returns 404 | Put it under `public/` and reference it with a leading `/`, for example `/images/example.png`. |
| A link opens the custom 404 page | Check the known frontend-only links above; their matching route has not been created yet. |
| Styling or aliases do not resolve | Confirm commands are run at the repository root and that `tailwind.config.ts` and `tsconfig.json` have not been moved. |

## Before opening a pull request

Run:

```bash
npm run lint
npm run build
```

Also check the homepage, `/login`, `/sign-up`, and a narrow mobile viewport after UI changes.
