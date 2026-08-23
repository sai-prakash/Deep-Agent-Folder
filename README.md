# AI Engineering Mastery

A GitHub-native, learn-by-building course based on the six AI application engineering skill areas described by Andrew Ng: **LLM foundations, grounding with data, agentic systems, evaluation-driven development, operating in production, and machine learning foundations** — plus an engineering bootcamp and production capstone.

## What is in this repository

- **Interactive GitHub Pages course**: no application backend and no runtime package dependencies.
- **84 hands-on lessons** following: Understand → Predict → Build → Break → Measure → Improve → Explain.
- **7 portfolio systems** and a production capstone.
- **Local-first progress** in the browser.
- **GitHub checkpoint sync**: learners create a prefilled progress issue; a deterministic Action validates and stores `progress/<github-user>.json`.
- **GitHub Agentic Workflow sources** for learning coach, lab reviewer, and course curator.
- **CI and Pages deployment** via GitHub Actions.

## Run locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Production URL

After Pages is enabled with **Settings → Pages → Build and deployment → GitHub Actions**, the deployment workflow publishes this repository at:

`https://sai-prakash.github.io/Deep-Agent-Folder/`

## Progress architecture

The browser never receives a GitHub write token.

1. Lesson state is saved instantly in `localStorage`.
2. **GitHub checkpoint** opens a prefilled issue containing a compact JSON snapshot.
3. `.github/workflows/progress-sync.yml` validates the snapshot, derives identity from the authenticated issue author, writes `progress/<user>.json`, comments, and closes the issue.
4. The course can restore progress by reading the public repository file through the GitHub Contents API.

This makes GitHub the durable progress database while keeping the site static.

## Agent suite

GitHub Agentic Workflows are defined as Markdown sources:

- `learning-coach.md` — Socratic help on `[Help]` issues.
- `lab-reviewer.md` — reviews learning/lab PRs against evidence and eval quality.
- `course-curator.md` — periodically identifies stale material and proposes tightly scoped updates.

GitHub Agentic Workflows are currently public preview. Their `.md` source must be compiled to hardened `.lock.yml` with `gh aw compile`. Supported engines include Copilot, Codex, Claude and Gemini. Authentication depends on the engine. See `AGENTS.md`.

## Course quality rule

A lesson is not complete because it was read. A learner must record a prediction, build something, reproduce a failure, measure it, and pass the mastery check.

## License

MIT for the course software and original curriculum structure. External referenced concepts and trademarks remain the property of their respective owners.
