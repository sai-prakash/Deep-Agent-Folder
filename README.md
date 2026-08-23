# AI Engineering Mastery Lab v2

An evidence-driven, LLM-native, GitHub-native learning program inspired by Andrew Ng’s AI Engineering Skills Map.

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

## Security / privacy

The OpenRouter key is stored only in `sessionStorage`. It is never placed in GitHub progress, course exports, source files or service-worker cache. Free/stealth model providers may have data-retention policies: never submit secrets, private employer code, customer data, regulated data or credentials.

## Development

```bash
python -m http.server 8000
# http://localhost:8000
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

The deterministic quality gate blocks structural/course regressions. `quality-reviewer.md` defines a semantic GitHub Agentic Workflow reviewer; `semantic-quality.yml` optionally invokes Ox Alpha through OpenRouter when the repository secret `OPENROUTER_API_KEY` exists. Semantic review is advisory unless explicitly made a required branch protection check.
