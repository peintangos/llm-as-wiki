# CLAUDE.md

## Project Overview

Ralph Matsuo is a docs-first OSS template for Claude Code and Ralph Loop.

This repository contains:

- reusable planning documents under `docs/prds/`
- a canonical Ralph command registry in `ralph.toml`
- interactive Claude Code skills under `.claude/skills/`
- headless execution scripts under `scripts/ralph/`
- GitHub Actions that connect issue intake, planning documents, autonomous execution, and PR creation
- local validation scripts for repository policy and workflow regressions

### Core Principle

Planning updates documents. Execution reads documents.

The active PRD directory is the control plane for feature work. Ralph should work from explicit artifacts such as `prd.md`, `specifications/`, `dependencies.md`, `progress.md`, and `todo.md` rather than from ad-hoc instructions alone.

### Tech Stack

- Runtime: Bash and Node.js (tooling only)
- Languages: Markdown, Bash, YAML, TOML
- Package manager: npm
- Automation: Git, GitHub Actions, Claude Code CLI, Codex CLI
- Validation entry points: `npm test`, `npm run test:doc-contracts`, `npm run test:orchestrator`, `npm run lint:repo`, `npm run lint:shell`, `npm run lint:actions`

### Project Command Registry

The canonical registry file is `ralph.toml`.

- `test_primary` - unit or primary repository tests
- `test_integration` - integration / E2E tests when they exist
- `build_check` - build verification
- `lint_check` - linting or static analysis
- `format_fix` - formatter (when configured)

Those role names are stable across repositories. The command strings stored in `ralph.toml` are repository-specific implementation details. This template repository intentionally leaves non-applicable roles as `N/A` until adopters replace them with real commands.

## Document System

### PRD Directory Structure

Each PRD is managed under `docs/prds/prd-{slug}/` with the following structure:

```text
docs/prds/prd-{slug}/
├── prd.md              # PRD body (requirements definition)
├── knowledge.md        # Reusable patterns and implementation notes
├── progress.md         # Specification-level progress tracking
├── todo.md             # Next executable tasks
├── dependencies.md     # Specification dependencies and implementation order
└── specifications/     # Feature specs in Gherkin format
    ├── spec-001-*.md
    ├── spec-002-*.md
    └── ...
```

Use `docs/prds/_template/` as the baseline when creating new PRDs.

### Other Documents

- `ralph.toml` — canonical Ralph command registry
- `docs/architecture.md` — system architecture and control flow
- `docs/roadmap.md` — repo-level direction and active PRDs
- `docs/references/` — project reference materials (security audits, external research, benchmarks, etc.)
- `docs/ubiquitous/` — project ubiquitous language dictionary (term definitions shared across the team)
- `README.md` — public entry point
- `raw/` — (experimental, scoped to `prd-llm-wiki`) immutable source documents for the LLM Wiki pattern; see `raw/README.md`
- `wiki/` — (experimental, scoped to `prd-llm-wiki`) LLM-maintained knowledge pages with `index.md` catalog and append-only `log.md`; see `wiki/README.md` and the "LLM Wiki" section below

### File Roles

- **`prd.md`**: defines the delivery scope and target branch in `## Branch`
- **`knowledge.md`**: stores reusable patterns, integration notes, and non-obvious lessons; do not use it as a task diary
- **`progress.md`**: tracks specification status using the exact values `pending`, `in-progress`, or `done`, with the exact columns `Specification | Title | Status | Completed On | Notes` and one row per specification file
- **`todo.md`**: lists executable tasks in priority order using checkbox lines; unchecked (`- [ ]`) tasks are pending, checked (`- [x]`) tasks are completed; each task should be small enough for one `/implement` run or one Ralph iteration
- **`dependencies.md`**: records dependency order between specifications
- **`specifications/`**: holds Gherkin-oriented specs with scenarios under `## Acceptance Criteria` and checkbox tasks under `## Implementation Steps`
- **`ralph.toml`**: maps Ralph command roles such as tests, build checks, lint checks, and format fixes to the repository's existing commands
- **`docs/references/`**: stores reference materials such as security audits, external documentation, research notes, and benchmarks; update when new reference material is obtained or existing material becomes outdated
- **`docs/ubiquitous/`**: maintains the project's ubiquitous language dictionary; update when new domain terms emerge, existing terms are redefined, or ambiguity is discovered in team communication
- **`raw/`**: stores immutable source documents for the LLM Wiki pattern. LLM may only read; humans may only write. File naming: `YYYY-MM-DD-slug.md`. Do not edit existing files; add a new dated version instead
- **`wiki/`**: holds LLM-compiled knowledge pages. Subdirectories: `sources/` (1-to-1 with `raw/`), `entities/`, `concepts/`, `synthesis/`. Keep `index.md` up-to-date as a one-line catalog of every page. Append-only `log.md` records every Ingest / Query / Lint operation as `## [YYYY-MM-DD] operation | title`

## LLM Wiki

This section defines the LLM Wiki schema loaded by Claude Code. The pattern follows Andrej Karpathy's [LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). This is an **experimental addition** scoped to this repository (`prd-llm-wiki`); upstream Ralph Matsuo template does not ship it yet.

### Three-Layer Architecture

```text
┌─────────────────────────────────────────────┐
│  raw/     — immutable source documents      │  ← human writes, LLM reads
├─────────────────────────────────────────────┤
│  wiki/    — LLM-maintained knowledge layer  │  ← LLM writes, human reviews
├─────────────────────────────────────────────┤
│  CLAUDE.md (this section) — schema & rules  │  ← co-evolved by both
└─────────────────────────────────────────────┘
```

- `raw/` stores immutable originals (articles, gists, papers, transcripts). You never edit existing raw files in place — add a new dated file instead.
- `wiki/` holds compiled knowledge: `sources/`, `entities/`, `concepts/`, `synthesis/`, plus `index.md` (catalog) and `log.md` (append-only operation log).
- This section of `CLAUDE.md` defines the operations. Update it when the schema evolves.

### Responsibility Boundary with Spec-Driven Work

- `docs/prds/` is the **delivery scope** control plane — scoped features, specifications, progress tracking.
- `wiki/` is the **cross-cutting knowledge** plane — persistent, compounding, reference-quality material.
- `wiki/` pages may cite PRDs for context, but PRDs do not depend on `wiki/` for execution. Do not put delivery-scoped work items (todos, progress, specs) into `wiki/`.

### Ingest

Run Ingest when new files appear under `raw/`. You (Claude Code) execute the following procedure:

1. **Scan** `raw/` and compare against `wiki/sources/`. Identify raw files that do not yet have a corresponding source page.
2. For each new raw file:
   1. Read the file in full.
   2. Write `wiki/sources/{slug}.md` using the template in `wiki/sources/README.md`. Include frontmatter with `source_path` pointing back to `raw/`, and include 3–5 pullquotes from the original.
   3. Identify **entities** (people, products, organizations) mentioned. For each:
      - If `wiki/entities/{slug}.md` does not exist, create it per the template in `wiki/entities/README.md`.
      - If it exists, append new observations and link the new source page.
   4. Identify **concepts** (methodologies, patterns, definitions). For each:
      - Create or update `wiki/concepts/{slug}.md` per `wiki/concepts/README.md`.
      - If multiple sources define the concept differently, record the divergence explicitly rather than silently picking one.
3. After processing all new raw files, decide whether a **synthesis** page is warranted (e.g., a comparison, mapping, or deep dive across the new sources). If yes, write `wiki/synthesis/{theme-slug}.md` per `wiki/synthesis/README.md`.
4. Update `wiki/index.md` to reflect every new and updated page with a one-line summary.
5. Append one entry to `wiki/log.md` in the form `## [YYYY-MM-DD] ingest | {short title}`, listing the number of sources ingested and the number of wiki pages added or updated.

Human role: place the raw sources, decide the theme for any synthesis, review the generated pages, curate clear errors.

### Query

Run Query when the human asks a question against the wiki:

1. Start by reading `wiki/index.md` to locate candidate pages.
2. Read the relevant pages (`sources/`, `concepts/`, `entities/`, `synthesis/`) in full. Do not rely on summaries alone.
3. Compose the answer with inline citations. Every claim sourced from the wiki must cite the specific wiki page (and, transitively, the raw original via `source_path`).
4. If the answer is structurally valuable beyond this one question (a new comparison, mapping, or timeline), save it as a new page under `wiki/synthesis/` and update `wiki/index.md`.
5. Append one entry to `wiki/log.md` in the form `## [YYYY-MM-DD] query | {question}`, listing the pages cited.

If the query cannot be answered from the existing wiki, say so explicitly and suggest which additional raw sources would be needed. Do not fabricate citations.

### Lint

Run Lint periodically (after several Ingest operations, or on demand):

1. **Contradictions.** Scan `wiki/concepts/` and `wiki/synthesis/` for pages that state conflicting claims. Record each pair.
2. **Stale claims.** For each `wiki/concepts/*.md`, check whether newer `wiki/sources/` (by `captured_at` or publication date) would update the claim. Flag candidates.
3. **Orphan pages.** Scan `wiki/` for pages that are not referenced by `wiki/index.md` or by any other wiki page. A page linked only from its own subdirectory's README still counts as an orphan.
4. **Missing cross-references.** For each entity or concept that appears by name inside another page's body, verify that the mention is wikilinked. Flag missed opportunities.
5. Produce a report and append one entry to `wiki/log.md` in the form `## [YYYY-MM-DD] lint | summary`, grouped by the four categories above with counts and the first few offenders in each.

Human role: review the report and fix clearly-wrong items. Do not auto-fix contradictions or stale claims — they need human judgment about which source is authoritative.

## Workflow

### Session Start

1. Run `/catchup` to summarize current state
2. Read the target PRD's `todo.md`
3. Confirm the next task is explicit and executable

### Planning Phase (Documents Only)

Use the following skills or plan mode to update planning artifacts:

- `/prd-create` / `/prd-enhance`
- `/spec-create`
- `/roadmap-update`
- `/req-update`
- `/docs-review`

The output of planning is a PRD set with:

- clear scope in `prd.md`
- executable steps in `specifications/`
- dependency order in `dependencies.md`
- a prioritized next-task list in `todo.md`

No source code changes should happen in this phase.

### Interactive Execution

In interactive sessions, use `/implement` to complete one todo task at a time.

Expected cycle:

1. gather context from the related PRD and specification
2. implement the task and add or update tests
3. run `/test`
4. run `/build-check` if the repository defines build or lint commands
5. **if the change affects web UI** (pages, components, styles, layouts), use `chrome-devtools` MCP to visually verify the rendered output — check for image loading, layout clipping, overflow, border rendering, and responsive breakpoints
6. run `/code-review`
7. update `progress.md`, `specifications/`, `todo.md`, and `knowledge.md`
8. commit with `/commit-push`

### Autonomous Execution (Ralph Loop)

For headless execution, Ralph uses `scripts/ralph/CLAUDE.md` as the instruction source:

```bash
./scripts/ralph/ralph.sh --tool claude --prd docs/prds/prd-{slug} [max_iterations]
```

Ralph Loop works from the same planning artifacts as interactive mode, but executes without slash commands.

If the PRD branch named in `prd.md` does not exist yet, Ralph creates it from the current HEAD before starting work.

The orchestrator processes at most one ready PRD per invocation. If multiple PRDs are ready, it selects the first `docs/prds/prd-*` directory in shell sort order, runs that PRD, and exits so a later scheduled or manual run can re-evaluate the remaining PRDs from the repository default branch state.

Each iteration should:

1. pick one todo task
2. implement it and write tests
3. run the configured tests and validation commands
4. update planning documents
5. commit and push on the PRD branch

See `scripts/ralph/CLAUDE.md` for the exact headless workflow.

### Completion Expectations

When work changes behavior or development flow, update the relevant documents:

- target PRD files under `docs/prds/prd-{slug}/`
- `docs/architecture.md` when structure or control flow changes
- `docs/roadmap.md` when priorities or active tracks change
- `README.md` when public-facing usage, setup, or automation behavior changes
- `docs/ubiquitous/` when new domain terms are introduced or redefined
- `docs/references/` when new reference material is obtained
