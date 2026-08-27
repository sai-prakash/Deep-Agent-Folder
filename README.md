# AI Engineering Mastery Lab v2

An evidence-driven, LLM-native, GitHub-native learning program. The product was originally inspired by Andrew Ng & DeepLearning.AI’s public **AI Engineering Skills Map** (August 2026) and is independently designed and implemented. **This project is not affiliated with, sponsored by, endorsed by, reviewed by, or certified by Andrew Ng or DeepLearning.AI.**

- **Product home + free diagnostic:** https://sai-prakash.github.io/ai-engineering-mastery/
- **101-lesson mastery lab:** https://sai-prakash.github.io/ai-engineering-mastery/course.html
- **Source framework:** https://www.andrewng.org/writing

## What changed in v2

- 101 lessons with mechanism-level explanations, worked failures, misconceptions, recall and transfer scenarios.
- 76 browser-executable labs: 71 Python, 3 JavaScript and 2 SQL.
- Python runs in **Pyodide 314.0.4 inside a module Web Worker**; JavaScript runs in an isolated Worker; SQL uses in-memory SQLite through Python.
- Environment-heavy labs use GitHub Codespaces and require a real public commit or PR artifact.
- OpenRouter learning studio supports `openrouter/free` and **Ox Alpha (`stealth/ox-alpha`)** plus custom models.
- Expert Panel runs teacher, systems-engineer and evaluator perspectives and synthesizes their disagreement.
- Mastery states: Introduced → Practiced → Verified → Production-ready.
- Verified is gated on implementation evidence **and** rubric review; prose alone cannot pass.
- Eight named synthetic data/incident collections in a versioned dataset pack for retrieval, evals, red teaming, model routing and ML.

## Product principle

**Evidence > eloquence.** Reading introduces a concept. Mastery requires an executable or verifiable artifact, a reproduced failure, measurement, causal reasoning and a defensible next experiment.

The public home deliberately does not copy Andrew Ng / DeepLearning.AI logos, imagery or visual identity. Their names are used only for factual attribution to the public skills-map source.

## Security / privacy

The OpenRouter key is stored only in `sessionStorage`. It is never placed in GitHub progress, course exports, source files or service-worker cache. Free/stealth model providers may have data-retention policies: never submit secrets, private employer code, customer data, regulated data or credentials.

## Development

```bash
python -m http.server 8000
# product home: http://localhost:8000/
# mastery lab:  http://localhost:8000/course.html
```

Run the production quality gate:

```bash
node scripts/quality-gate.mjs
python scripts/security-audit.py
```

## OpenRouter examples

```bash
export OPENROUTER_API_KEY='...'
python examples/openrouter_python.py
node examples/openrouter_node.mjs
```

## CI agents

The deterministic quality gate blocks structural/course and public-product regressions. `quality-reviewer.md` defines a semantic GitHub Agentic Workflow reviewer; `semantic-quality.yml` optionally invokes Ox Alpha through OpenRouter when the repository secret `OPENROUTER_API_KEY` exists. Semantic review is advisory unless explicitly made a required branch protection check.
