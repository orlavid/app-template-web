# Web application template

This repository is the start point for each web application that the build platform makes. Copy it to start a new application.

## Stack

- Vite, React and TypeScript in strict mode.
- Tailwind CSS 4 with shadcn/ui primitives.
- shadcn CLI version 4.23.0, with the `radix-nova` style.
- `react-hook-form` and zod for forms.
- Vitest and Testing Library for unit tests.
- Playwright and axe for end-to-end tests.
- ESLint, Stylelint and Vale for checks.

## Requirements

- Node.js 22 or later.
- npm 10 or later.
- Vale 3. On macOS, run `brew install vale`.
- Docker, only to update the Linux screenshot baselines.

## Set up a new application

1. Copy this repository to a new folder.
2. Go to the new folder.
3. Run `python3 "$PLATFORM_ROOT/scripts/platform.py" start`.
4. Run `npm ci` to install the packages.
5. Run `npx playwright install chromium` to install the test browser.
6. Run `npm run check` to make sure that all checks pass.
7. Run `npm run dev` to start the development server.

## Commands

| Command | Result |
| --- | --- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Makes the production build in `dist/`. |
| `npm run typecheck` | Runs the TypeScript compiler. |
| `npm run lint` | Runs ESLint. |
| `npm run lint:css` | Runs Stylelint. |
| `npm run test` | Runs Vitest with an 80% line coverage limit. |
| `npm run test:e2e` | Runs Playwright with Chromium. |
| `npm run docs:lint` | Runs Vale on all Markdown files. |
| `npm run check` | Runs all the checks in sequence. |

## Folders

- `src/components/ui/`: shadcn/ui primitives. The shadcn CLI writes these files.
- `src/components/<feature>/`: product components. The example is `contact-form/`.
- `src/styles/tokens.css`: the design tokens for the light theme and the dark theme.
- `e2e/`: Playwright tests and screenshot baselines.
- `specs/`: feature specs from Spec Kit.
- `docs/glossary.md`: the approved project terms.
- `.vale/styles/STE/`: the Simplified Technical English rules.

## Rules

`AGENTS.md` gives all the rules. The checks enforce these rules:

- ESLint stops a Radix import outside `src/components/ui/`.
- Stylelint stops a hex colour outside `src/styles/tokens.css`.
- Vitest stops the build when line coverage is less than 80%.
- Playwright stops the build when axe finds a violation.
- Playwright stops the build when a screenshot does not agree with its baseline.
- Vale stops the build when a Markdown file breaks an STE rule.

## Screenshot baselines

Each platform has its own baselines in `e2e/__screenshots__/<platform>/`. CI uses the Linux baselines.

CAUTION: Do not update the baselines to make a failed test pass. First, find the cause of the difference.

1. Run `npm run test:e2e:update` to update the baselines for your platform.
2. Start Docker.
3. Run `./scripts/update-linux-screenshots.sh` to update the Linux baselines.
4. Examine each changed image before you commit it.

## Writing rules

All Markdown files use Simplified Technical English. Vale checks the files in CI. The rules come from ASD-STE100, but this repository does not contain the ASD-STE100 dictionary.

To add a project term:

1. Add the term and its sense to `docs/glossary.md`.
2. Add the term to `.vale/styles/config/vocabularies/Project/accept.txt`.
3. Run `npm run docs:lint`.
