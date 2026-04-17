# Architecture

## Summary

Ralph Matsuo is a docs-first OSS template that treats PRD artifacts as the execution control plane. The repository contains no application runtime; it ships Claude Code skills, Ralph Loop scripts, GitHub Actions workflows, and document templates that support the automation contract.

## Tech Stack

- Runtime: Bash and Node.js
- Languages: Markdown, Bash, YAML, TOML
- Package manager: npm
- Command registry: `ralph.toml`
- Automation: Bash, Git, GitHub Actions
- Agent runtime: Claude Code CLI

## Runtime Surfaces

| Surface | Purpose | Notes |
|---------|---------|-------|
| Planning docs | `docs/prds/` | Source of truth for scoped work |
| Interactive workflow | `.claude/skills/` | Slash-command-driven execution |
| Claude hooks and rules | `.claude/hooks/`, `.claude/rules/` | Guardrails and repo conventions |
| Headless workflow | `scripts/ralph/` | Autonomous execution path |
| CI automation | `.github/workflows/` | PRD creation and Ralph Loop |
| Local validation | `package.json`, `scripts/` | Repo policy and regression checks |
| IaC (optional) | `infra/` | CDK stack for EC2 self-hosted runner |
| LLM Wiki raw (experimental) | `raw/` | Immutable source documents for the LLM Wiki pattern; added by `prd-llm-wiki`, scoped to this experiment repository |

## Repository Structure

```text
[repo root]
├── CLAUDE.md
├── ralph.toml
├── package.json
├── .claude/
│   ├── agents/
│   ├── skills/
│   ├── rules/
│   ├── hooks/
│   └── settings.json
├── docs/
│   ├── architecture.md
│   ├── roadmap.md
│   ├── references/       # project reference materials
│   ├── ubiquitous/       # ubiquitous language dictionary
│   └── prds/
│       └── _template/
├── raw/                  # (experimental, prd-llm-wiki) immutable source layer for LLM Wiki
├── scripts/
│   ├── ralph/
│   ├── lint-repo.sh
│   └── test-*.sh
├── infra/                  (optional CDK project)
│   ├── bin/
│   ├── lib/
│   └── scripts/
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── scripts/
    └── workflows/
```

## Control Flow

1. Work enters through interactive Claude planning or a GitHub issue labeled for PRD creation.
2. Authoritative scoped state lives under `docs/prds/prd-{slug}/`.
3. Interactive skills or `scripts/ralph/ralph.sh` execute one todo task at a time from the active PRD.
4. Validation commands come from `ralph.toml`; unsupported roles can stay `N/A` in the template repository.
5. Each Ralph iteration commits and pushes changes to the branch named in the PRD's `## Branch` section.
6. Each orchestrator invocation selects at most one ready PRD, executes it, and exits.
7. In GitHub Actions, a pull request can be created after the Ralph run completes.

## Validation Commands

- Canonical registry file: `ralph.toml`
- Standard roles: `test_primary`, `test_integration`, `build_check`, `lint_check`, `format_fix`
- Template defaults: `test_primary` points at repository regression checks; optional build/lint/format roles remain `N/A` until adopters configure them

## External Dependencies

- Claude Code CLI (`claude`)
- Git and optionally GitHub CLI (`gh`)
- `ANTHROPIC_API_KEY` for GitHub Actions automation (not needed with OAuth on self-hosted runners)
- `jq` for Claude hook scripts
- AWS CLI and Session Manager Plugin (optional, for EC2 runner provisioning)
