# Agent instructions

These instructions apply to all agents and all people that work in this repository. `CLAUDE.md` points to this file.

## 1. Start here

Do these steps before you change application code:

1. Set `PLATFORM_ROOT` to the local build-platform checkout.
2. Go to the root of this repository.
3. Run `python3 "$PLATFORM_ROOT/scripts/platform.py" start`.
4. Answer the questions that the command asks. Use an interactive terminal.
5. Read `.platform/project-profile.json`.

Do not write application code until the command saves a valid profile.

## 2. Phases and exit gates

The work has five phases. A phase starts only when the previous phase meets its exit gate.

### Phase 0: Start

1. Run the platform `start` command.
2. Confirm that this checkout is the destination.

Exit gate: `.platform/project-profile.json` exists, and the `start` command accepts it.

### Phase 1: Specify

1. Run `/speckit-specify` to write the spec.
2. Run `/speckit-clarify` to answer the open questions.

Exit gate: the spec has no `[NEEDS CLARIFICATION]` markers. Each requirement has a falsifier. Each success criterion has a number.

### Phase 2: Plan and design

1. Run `/speckit-plan`.
2. Run `/speckit-tasks`.
3. Select the shadcn/ui primitives for each screen.
4. Add missing tokens to `src/styles/tokens.css`.

Exit gate: `plan.md` and `tasks.md` exist. Each requirement has a task and a test.

### Phase 3: Build

1. Write a test that fails.
2. Write the code that makes the test pass.
3. Run `npm run check`.

Exit gate: `npm run check` exits with code 0.

### Phase 4: Ship

1. Push a branch.
2. Open a pull request.
3. Get a human review.

Exit gate: CI passes on the pull request, and a human approves it.

## 3. Specs

Specs live in `specs/NNN-name/`. `NNN` is a three-digit number. Spec Kit creates the folder. Each folder holds `spec.md`, `plan.md` and `tasks.md`.

## 4. Commands

- `npm run dev`: start the development server.
- `npm run build`: make the production build.
- `npm run typecheck`: run the TypeScript compiler in strict mode.
- `npm run lint`: run ESLint.
- `npm run lint:css`: run Stylelint.
- `npm run test`: run Vitest with coverage. The line coverage limit is 80%.
- `npm run test:e2e`: run Playwright with Chromium.
- `npm run docs:lint`: run Vale on all Markdown files.
- `npm run check`: run all the checks above in sequence.

## 5. shadcn/ui rules

- Use shadcn/ui primitives for buttons, dialogs, forms, menus and tables. Do not make these controls from plain HTML elements.
- Add a primitive with `npx shadcn@4.23.0 add <name>`. The primitive goes into `src/components/ui/`.
- Do not add `shadcn` to `package.json`. Use the pinned `npx` command. The CSS helpers are in `src/styles/vendor/shadcn-tailwind.css`.
- Put product components in `src/components/<feature>/`.
- Product components use the primitives. They never import Radix. ESLint stops a Radix import outside `src/components/ui/`.
- Keep edits to `src/components/ui/` small. Put a `// local change:` comment above each edit, with the reason.
- Use tokens for colour, spacing and radius. Do not write a hard-coded value. Stylelint stops a hex colour outside `src/styles/tokens.css`.
- Each control must work with the keyboard only. The axe check must find zero violations.
- Build each form with `react-hook-form` and a zod schema.
- The server must validate the same zod schema again. Client validation is not a security control.
- Test each screen in the light theme and in the dark theme.
- Add a screenshot test for each screen at 320, 768, 1024 and 1440 pixels.

## 6. Writing rules

All Markdown files use Simplified Technical English. These rules come from ASD-STE100.

- Write procedure sentences with 20 words or fewer.
- Write description sentences with 25 words or fewer.
- Write one instruction in each sentence.
- Write instructions in the imperative form.
- Use the active voice.
- Write paragraphs with 6 sentences or fewer.
- Give each word one sense. Use the senses in `docs/glossary.md`.
- Put a warning before the step that it applies to.
- Write steps as a numbered vertical list.

Vale checks these rules in CI. The rules are in `.vale/styles/STE/`. Run `npm run docs:lint` before you push.

## 7. Screenshot baselines

CAUTION: Linux and macOS draw fonts differently. Do not copy macOS baselines into the Linux folder.

1. Run `npm run test:e2e:update` to update the macOS baselines.
2. Start Docker.
3. Run `./scripts/update-linux-screenshots.sh` to update the Linux baselines.
4. Examine each changed image before you commit it.

## 8. Definition of done

A change is complete when these conditions are true:

- `npm run check` exits with code 0.
- The change has tests.
- A user can get to the change through the user interface or the command line.
- The report gives each command that ran, with its exit code.
