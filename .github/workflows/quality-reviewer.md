---
name: Senior Curriculum Quality Reviewer
on:
  pull_request:
    types: [opened, synchronize, reopened]
engine: codex
permissions:
  contents: read
  pull-requests: read
tools:
  github:
    toolsets: [pull_requests, repos]
safe-outputs:
  add-comment:
    max: 1
---
# Senior AI Engineering curriculum gate
Review the PR as a principal AI engineer, educator and evaluator. Reject superficial completeness. Inspect changed curriculum, labs, datasets, runtime and mastery logic.

Block on any of these:
- a lesson can be verified from prose alone;
- concepts are defined without mechanism/failure/eval depth;
- executable labs do not test a meaningful invariant;
- environment-heavy labs pretend to run safely in browser;
- OpenRouter credentials can persist into repo/progress/localStorage;
- free/stealth providers are presented without a data-policy warning;
- agentic content lacks permissions, state, tracing, loop limits or adversarial considerations where relevant;
- eval content ignores evaluator quality, slices, uncertainty or regression coverage;
- production content ignores cost, latency, security and incident response.

Comment with: score /100, blockers, major gaps, strongest elements, and the single highest-leverage next improvement. 90+ with zero blockers is merge quality.
