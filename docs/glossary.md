# Glossary

This glossary gives the approved project terms. Each term has one sense. Do not use a term in a different sense.

Vale reads the term list in `.vale/styles/config/vocabularies/Project/accept.txt`. Add a new term to this glossary and to that file in the same change.

## Terms

- **Application:** The product that a team builds from this template.
- **Baseline:** An approved screenshot. Playwright compares each new screenshot with its baseline.
- **Breakpoint:** A viewport width that the screenshot tests use. The widths are 320, 768, 1024 and 1440 pixels.
- **Check:** A command that exits with code 0 when the code obeys a rule. An example is `npm run lint`.
- **Component:** A React function that returns user interface elements.
- **Description:** Text that tells the reader about a thing. A description sentence has 25 words or fewer.
- **Exit gate:** The condition that a phase must meet before the next phase starts.
- **Phase:** One of the five work stages: Start, Specify, Plan and design, Build, Ship.
- **Primitive:** A shadcn/ui component in `src/components/ui/`. Primitives give buttons, dialogs, forms, menus and tables.
- **Procedure:** A list of steps that the reader does. A procedure sentence has 20 words or fewer.
- **Product component:** A component in `src/components/<feature>/`. A product component uses primitives. It does not use Radix.
- **Schema:** A zod object that defines valid input. The browser and the server use the same schema.
- **Spec:** The feature specification in `specs/NNN-name/spec.md`.
- **Theme:** A set of token values. The template has a light theme and a dark theme.
- **Token:** A CSS custom property in `src/styles/tokens.css`. Examples are `--primary` and `--radius`.
