---
name: Course Curator
on:
  schedule: weekly on monday
  workflow_dispatch:
engine: codex
permissions:
  contents: read
  issues: read
  pull-requests: read
tools:
  github:
    toolsets: [issues, pull_requests, repos]
safe-outputs:
  create-issue:
    title-prefix: "[Curriculum audit] "
    close-older-issues: true
---
# Keep the course technically current without chasing hype

Audit this repository as a curriculum maintainer. Focus on technologies that change quickly: model APIs, tool calling, MCP, agent harnesses, GitHub Agentic Workflows, eval techniques, security guidance, and production operations.

Create one issue only if there are material update candidates. The issue must separate:
1. **Verified stale or incorrect content** — cite the exact file/lesson and the evidence available to you.
2. **Potentially stale content needing human verification** — clearly label uncertainty.
3. **Missing durable concept** — explain why it belongs independent of a specific vendor.
4. **Proposed minimal edits** — avoid framework churn.
5. **Regression/eval impact** — what learner behavior should be re-tested after updating.

Do not rewrite the course merely because a new library is popular. Durable engineering principles take priority over product marketing.
