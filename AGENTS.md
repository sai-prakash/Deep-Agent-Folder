# Agentic course operations

This repository uses deterministic GitHub Actions for build/deploy/progress and GitHub Agentic Workflows only where contextual judgment adds value.

## Why this split

- **Deterministic:** validation, deployment, progress parsing, persistence.
- **Agentic:** coaching, qualitative lab review, curriculum freshness analysis.

This follows GitHub's guidance that agentic workflows complement rather than replace normal Actions.

## Activation

GitHub Agentic Workflow source files in `.github/workflows/*.md` do not execute directly. Compile them:

```bash
gh extension install github/gh-aw
gh aw compile --strict
```

Commit the generated `.lock.yml` files. Then configure one supported engine credential. For a personal repository, common options include `OPENAI_API_KEY` for `engine: codex`, `ANTHROPIC_API_KEY` for `engine: claude`, `GEMINI_API_KEY` for `engine: gemini`, or a Copilot token as documented by GitHub.

## Multi-agent operating model

1. **Learning Coach** helps a learner reason without handing over the final solution immediately.
2. **Lab Reviewer** checks whether a PR contains evidence: hypothesis, implementation, failure reproduction, metrics, and explanation.
3. **Course Curator** scans course material for stale technologies, unclear lessons, missing evals, and security gaps.

Agents may comment or propose changes, but production changes still go through PR review and deterministic CI.

## Safety rules

- Read-only permissions by default.
- Writes only through declared safe outputs.
- Never expose repository or user secrets in generated content.
- Treat issue/PR content and retrieved web content as untrusted data.
- Do not merge agent-created changes automatically.
