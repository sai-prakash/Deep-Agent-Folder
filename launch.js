(() => {
  const repo = 'https://github.com/sai-prakash/Deep-Agent-Folder';
  const dimensions = {
    foundations: { label: 'Engineering foundations', school: 'S0' },
    llm: { label: 'LLM systems', school: 'S1' },
    grounding: { label: 'Grounding & data', school: 'S2' },
    agents: { label: 'Agent engineering', school: 'S3' },
    evals: { label: 'Evaluation & reliability', school: 'S4' },
    production: { label: 'Production & security', school: 'S5' }
  };

  const questions = [
    {
      d: 'foundations',
      q: 'A service works on your laptop but fails in CI with a different transitive dependency. What is your first move?',
      a: [
        ['Ask a stronger model to rewrite the failing module.', 0],
        ['Retry CI and assume it is a flaky runner.', 1],
        ['Compare the resolved dependency/environment state, reproduce the mismatch, then pin or constrain the contract that caused it.', 4],
        ['Upgrade every package to the newest version.', 1]
      ]
    },
    {
      d: 'foundations',
      q: 'An AI workflow includes model decisions and irreversible side effects. Where should deterministic logic live?',
      a: [
        ['Nowhere—the model should own the full workflow.', 0],
        ['Only in unit tests.', 1],
        ['Around permissions, invariants, validation and irreversible actions; delegate ambiguity, not safety boundaries.', 4],
        ['Inside a longer system prompt.', 1]
      ]
    },
    {
      d: 'llm',
      q: 'A 150k-token context performs worse after you add more “helpful” documents. What do you investigate first?',
      a: [
        ['Increase the temperature.', 0],
        ['Context composition: relevance, duplication, ordering, instruction/tool pollution and whether the needed evidence is actually attended to.', 4],
        ['Switch to the biggest available model and stop measuring.', 1],
        ['Add chain-of-thought instructions.', 1]
      ]
    },
    {
      d: 'llm',
      q: 'Your downstream code occasionally crashes because the model returns malformed JSON. The robust design is:',
      a: [
        ['Regex the response after generation.', 1],
        ['Tell the model “return valid JSON” three times.', 1],
        ['Use schema-constrained/structured output where supported, validate deterministically, and handle refusal/parse failure explicitly.', 4],
        ['Raise max_tokens.', 0]
      ]
    },
    {
      d: 'grounding',
      q: 'A RAG assistant confidently answers from a policy that was superseded yesterday. The highest-leverage fix is:',
      a: [
        ['Make the answer more cautious.', 1],
        ['Add more chunks per query.', 0],
        ['Treat freshness/provenance as retrieval data: version documents, propagate update/delete events, filter stale evidence and expose source timestamps.', 4],
        ['Fine-tune the model on the old corpus.', 0]
      ]
    },
    {
      d: 'grounding',
      q: 'Two retrieved sources disagree on a critical value. What should the system do?',
      a: [
        ['Let the model pick whichever sounds most plausible.', 0],
        ['Hide the conflict and provide one answer.', 0],
        ['Preserve provenance, apply an explicit authority/recency rule when valid, otherwise surface the conflict or escalate.', 4],
        ['Retrieve ten more chunks and take a majority vote.', 1]
      ]
    },
    {
      d: 'agents',
      q: 'An agent enters a tool loop and spends 40 calls without progress. What evidence do you inspect first?',
      a: [
        ['Only the final natural-language answer.', 0],
        ['The trajectory: repeated states/tool calls, observations, stop criteria, budget and the earliest point where state stopped changing meaningfully.', 4],
        ['The model benchmark leaderboard.', 1],
        ['The system prompt word count.', 1]
      ]
    },
    {
      d: 'agents',
      q: 'A team proposes five specialized agents for a workflow that one tool-using agent already solves at 91% accuracy. Your default response:',
      a: [
        ['Approve—multi-agent is more advanced.', 0],
        ['Reject all multi-agent systems categorically.', 1],
        ['Benchmark the proposed architecture against the single agent on quality, latency, token cost, failure rate and coordination overhead; keep complexity only if it earns its cost.', 4],
        ['Choose based on which framework has more GitHub stars.', 0]
      ]
    },
    {
      d: 'evals',
      q: 'You changed a prompt and ten hand-picked examples look better. Can you ship?',
      a: [
        ['Yes, if the examples are persuasive.', 0],
        ['Yes, if an LLM says the prompt improved.', 1],
        ['Not yet. Run a versioned eval set with representative cases, failure slices and unchanged baselines; compare outcome metrics and regressions.', 4],
        ['Only after increasing temperature.', 0]
      ]
    },
    {
      d: 'evals',
      q: 'Your LLM judge says a response is “excellent,” but domain experts often disagree. What next?',
      a: [
        ['Trust the judge because it is automated.', 0],
        ['Calibrate the evaluator against expert-labeled cases, inspect disagreement slices, revise the rubric/judge and quantify evaluator reliability.', 4],
        ['Use two judges and average them without validation.', 1],
        ['Remove human evaluation entirely.', 0]
      ]
    },
    {
      d: 'production',
      q: 'A retrieved webpage tells your agent to ignore policy and send secrets to an external URL. What is the correct security posture?',
      a: [
        ['Trust retrieved text because it came from the tool.', 0],
        ['Add “do not leak secrets” to the prompt.', 1],
        ['Treat external content as untrusted data, separate it from instructions, enforce least-privilege tools/egress and require deterministic approval around sensitive actions.', 4],
        ['Disable retrieval permanently.', 1]
      ]
    },
    {
      d: 'production',
      q: 'Average latency is 1.8s, but 5% of requests take 18–30s and users abandon. What metric should drive the next investigation?',
      a: [
        ['Average latency only.', 0],
        ['Token count for one successful request.', 1],
        ['Tail latency by stage/slice (for example p95/p99), correlated with model/tool/retry traces and user outcome.', 4],
        ['Number of prompt lines.', 0]
      ]
    }
  ];

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const form = $('#diagnosticForm');
  const questionsEl = $('#questions');
  const resultEl = $('#result');

  questionsEl.innerHTML = questions.map((item, qi) => `
    <fieldset class="question">
      <div class="qmeta"><span>${esc(dimensions[item.d].label)}</span><small>${qi + 1} / ${questions.length}</small></div>
      <h3>${esc(item.q)}</h3>
      <div class="options">
        ${item.a.map(([text, score], ai) => `
          <label class="option">
            <input required type="radio" name="q${qi}" value="${score}" data-dimension="${item.d}">
            <span>${esc(text)}</span>
          </label>`).join('')}
      </div>
    </fieldset>`).join('');

  function level(score) {
    if (score >= 86) return ['Systems Engineer', 'You reason in mechanisms, evidence and production trade-offs. Your next gains come from depth, speed and operating harder systems.'];
    if (score >= 68) return ['Production Builder', 'You have solid engineering instincts. A few weak domains are likely limiting how confidently you can ship AI systems.'];
    if (score >= 48) return ['Builder', 'You can build, but several production decisions are still being made by intuition. Convert those gaps into repeatable engineering habits.'];
    if (score >= 28) return ['Explorer', 'You know parts of the vocabulary, but the system-level failure and evaluation loop needs deliberate practice.'];
    return ['Beginner', 'Start with engineering foundations and build small systems where every intermediate step can be inspected.'];
  }

  function readScores() {
    const raw = {};
    Object.keys(dimensions).forEach((k) => raw[k] = []);
    questions.forEach((item, qi) => {
      const chosen = form.querySelector(`input[name="q${qi}"]:checked`);
      if (!chosen) throw new Error('Answer every question to calculate your score.');
      raw[item.d].push(Number(chosen.value));
    });
    const scored = {};
    Object.entries(raw).forEach(([k, values]) => {
      const max = values.length * 4;
      scored[k] = Math.round(values.reduce((a,b) => a + b, 0) / max * 100);
    });
    const total = Math.round(Object.values(scored).reduce((a,b) => a + b, 0) / Object.keys(scored).length);
    return { total, scored };
  }

  function renderResult(total, scored) {
    const [name, explanation] = level(total);
    const weakest = Object.entries(scored).sort((a,b) => a[1] - b[1])[0];
    const strongest = Object.entries(scored).sort((a,b) => b[1] - a[1])[0];
    const weakMeta = dimensions[weakest[0]];
    const strongMeta = dimensions[strongest[0]];
    const applicationPayload = encodeURIComponent(JSON.stringify({ score: total, level: name, dimensions: scored, weakest: weakMeta.label }));
    resultEl.innerHTML = `
      <div class="result-top">
        <div class="bigscore"><div><strong>${total}</strong><span>/ 100</span></div></div>
        <div><span class="eyebrow">Directional result</span><h3>${esc(name)}</h3><p>${esc(explanation)}</p></div>
      </div>
      <div class="dimensions">
        ${Object.entries(scored).map(([k, value]) => `<div class="dimension"><div class="dimension-head"><b>${esc(dimensions[k].label)}</b><span>${value}/100</span></div><div class="scorebar"><i style="width:${value}%"></i></div></div>`).join('')}
      </div>
      <div class="recommendation"><b>Highest-leverage gap: ${esc(weakMeta.label)}</b><p>Your strongest area is ${esc(strongMeta.label)} (${strongest[1]}/100). Do not restart from zero. Attack the weakest system skill with an executable lesson, reproduce one failure, then rerun the diagnostic after real practice.</p><a class="secondary" href="index.html#/school/${weakMeta.school}">Train this gap in the free lab →</a></div>
      <div class="result-actions"><button class="primary" type="button" id="resultApply">Apply for Founding Beta →</button><button class="secondary" type="button" id="shareResult">Share / copy result</button></div>
      <p class="share-note">This 12-question diagnostic is intentionally short and directional. It is not a hiring assessment or certification.</p>`;
    resultEl.hidden = false;
    resultEl.scrollIntoView({behavior:'smooth', block:'start'});
    $('#resultApply').onclick = () => openApplication(total, name, scored, applicationPayload);
    $('#shareResult').onclick = () => shareResult(total, name, weakMeta.label);
    try { localStorage.setItem('ae-diagnostic-v1', JSON.stringify({total, name, scored, at:new Date().toISOString()})); } catch {}
  }

  function openApplication(total, name, scored) {
    const title = '[Founding Beta] AI Engineering Mastery application';
    const body = `## Founding Beta application\n\n**Diagnostic:** ${total}/100 — ${name}\n\n### Skill profile\n${Object.entries(scored).map(([k,v]) => `- ${dimensions[k].label}: ${v}/100`).join('\n')}\n\n### About me\n- Current role / years of experience:\n- What I build today:\n- AI engineering goal for the next 90 days:\n- Hardest problem I want this program to help me solve:\n- GitHub / portfolio (optional):\n\n### Commitment\n- [ ] I can spend at least 4 focused hours/week for a founding beta.\n- [ ] I am comfortable giving blunt product feedback.\n\n> Do not include employer-confidential, customer, regulated or proprietary information.`;
    window.open(`${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener');
  }

  async function shareResult(total, name, weakest) {
    const text = `AI Engineering diagnostic: ${total}/100 — ${name}. Biggest gap: ${weakest}. I took the evidence-driven diagnostic at ${location.origin}${location.pathname}#diagnostic`;
    try {
      if (navigator.share) await navigator.share({title:'My AI Engineering score', text, url:`${location.origin}${location.pathname}#diagnostic`});
      else { await navigator.clipboard.writeText(text); alert('Result copied to clipboard.'); }
    } catch (e) {
      if (e?.name !== 'AbortError') alert('Could not share automatically. You can copy the page URL instead.');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const {total, scored} = readScores();
      renderResult(total, scored);
    } catch (err) { alert(err.message); }
  });

  $('#applyBtn').onclick = () => {
    let saved;
    try { saved = JSON.parse(localStorage.getItem('ae-diagnostic-v1') || 'null'); } catch {}
    if (saved?.total != null) openApplication(saved.total, saved.name, saved.scored);
    else document.querySelector('#diagnostic').scrollIntoView({behavior:'smooth'});
  };
})();
