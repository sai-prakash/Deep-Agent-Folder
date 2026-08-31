(() => {
  const repo = 'https://github.com/sai-prakash/ai-engineering-mastery';
  const STORAGE = 'ae-diagnostic-v2';
  const dimensions = {
    foundations: { label: 'Engineering foundations', school: 'S0' },
    llm: { label: 'LLM systems', school: 'S1' },
    grounding: { label: 'Grounding & data', school: 'S2' },
    agents: { label: 'Agent engineering', school: 'S3' },
    evals: { label: 'Evaluation & reliability', school: 'S4' },
    production: { label: 'Production & security', school: 'S5' }
  };

  const questions = [
    { d:'foundations', q:'A service works on your laptop but fails in CI with a different transitive dependency. What is your first move?', a:[['Ask a stronger model to rewrite the failing module.',0],['Retry CI and assume it is a flaky runner.',1],['Compare the resolved dependency/environment state, reproduce the mismatch, then pin or constrain the contract that caused it.',4],['Upgrade every package to the newest version.',1]] },
    { d:'foundations', q:'An AI workflow includes model decisions and irreversible side effects. Where should deterministic logic live?', a:[['Nowhere—the model should own the full workflow.',0],['Only in unit tests.',1],['Around permissions, invariants, validation and irreversible actions; delegate ambiguity, not safety boundaries.',4],['Inside a longer system prompt.',1]] },
    { d:'llm', q:'A 150k-token context performs worse after you add more “helpful” documents. What do you investigate first?', a:[['Increase the temperature.',0],['Context composition: relevance, duplication, ordering, instruction/tool pollution and whether the needed evidence is actually attended to.',4],['Switch to the biggest available model and stop measuring.',1],['Add chain-of-thought instructions.',1]] },
    { d:'llm', q:'Your downstream code occasionally crashes because the model returns malformed JSON. The robust design is:', a:[['Regex the response after generation.',1],['Tell the model “return valid JSON” three times.',1],['Use schema-constrained/structured output where supported, validate deterministically, and handle refusal/parse failure explicitly.',4],['Raise max_tokens.',0]] },
    { d:'grounding', q:'A RAG assistant confidently answers from a policy that was superseded yesterday. The highest-leverage fix is:', a:[['Make the answer more cautious.',1],['Add more chunks per query.',0],['Treat freshness/provenance as retrieval data: version documents, propagate update/delete events, filter stale evidence and expose source timestamps.',4],['Fine-tune the model on the old corpus.',0]] },
    { d:'grounding', q:'Two retrieved sources disagree on a critical value. What should the system do?', a:[['Let the model pick whichever sounds most plausible.',0],['Hide the conflict and provide one answer.',0],['Preserve provenance, apply an explicit authority/recency rule when valid, otherwise surface the conflict or escalate.',4],['Retrieve ten more chunks and take a majority vote.',1]] },
    { d:'agents', q:'An agent enters a tool loop and spends 40 calls without progress. What evidence do you inspect first?', a:[['Only the final natural-language answer.',0],['The trajectory: repeated states/tool calls, observations, stop criteria, budget and the earliest point where state stopped changing meaningfully.',4],['The model benchmark leaderboard.',1],['The system prompt word count.',1]] },
    { d:'agents', q:'A team proposes five specialized agents for a workflow that one tool-using agent already solves at 91% accuracy. Your default response:', a:[['Approve—multi-agent is more advanced.',0],['Reject all multi-agent systems categorically.',1],['Benchmark the proposed architecture against the single agent on quality, latency, token cost, failure rate and coordination overhead; keep complexity only if it earns its cost.',4],['Choose based on which framework has more GitHub stars.',0]] },
    { d:'evals', q:'You changed a prompt and ten hand-picked examples look better. Can you ship?', a:[['Yes, if the examples are persuasive.',0],['Yes, if an LLM says the prompt improved.',1],['Not yet. Run a versioned eval set with representative cases, failure slices and unchanged baselines; compare outcome metrics and regressions.',4],['Only after increasing temperature.',0]] },
    { d:'evals', q:'Your LLM judge says a response is “excellent,” but domain experts often disagree. What next?', a:[['Trust the judge because it is automated.',0],['Calibrate the evaluator against expert-labeled cases, inspect disagreement slices, revise the rubric/judge and quantify evaluator reliability.',4],['Use two judges and average them without validation.',1],['Remove human evaluation entirely.',0]] },
    { d:'production', q:'A retrieved webpage tells your agent to ignore policy and send secrets to an external URL. What is the correct security posture?', a:[['Trust retrieved text because it came from the tool.',0],['Add “do not leak secrets” to the prompt.',1],['Treat external content as untrusted data, separate it from instructions, enforce least-privilege tools/egress and require deterministic approval around sensitive actions.',4],['Disable retrieval permanently.',1]] },
    { d:'production', q:'Average latency is 1.8s, but 5% of requests take 18–30s and users abandon. What metric should drive the next investigation?', a:[['Average latency only.',0],['Token count for one successful request.',1],['Tail latency by stage/slice (for example p95/p99), correlated with model/tool/retry traces and user outcome.',4],['Number of prompt lines.',0]] }
  ];

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const validViews = new Set(['overview','diagnostic','method','founding']);
  const state = { current:0, answers:Array(questions.length).fill(null), result:null };

  function transition(fn){
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(fn);
    else fn();
  }

  function setView(view, push=true){
    if(!validViews.has(view)) view='overview';
    transition(() => {
      $$('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel===view));
      $$('.rail-tab').forEach(b => { const on=b.dataset.view===view; b.classList.toggle('active',on); b.setAttribute('aria-selected',String(on)); });
    });
    if(push && location.hash !== `#${view}`) history.pushState(null,'',`#${view}`);
    if(view==='diagnostic') setTimeout(()=>$('#diagCard:not([hidden]) .option-btn')?.focus({preventScroll:true}),120);
  }

  $$('[data-view]').forEach(el => el.addEventListener('click', e => {
    if(el.tagName==='A') e.preventDefault();
    setView(el.dataset.view);
  }));
  addEventListener('popstate',()=>setView(location.hash.slice(1)||'overview',false));

  function level(score){
    if(score>=86) return ['Systems Engineer','You reason in mechanisms, evidence and production trade-offs. Your next gains come from depth, speed and harder operating conditions.'];
    if(score>=68) return ['Production Builder','You have solid engineering instincts. A few weak domains are probably limiting how confidently you can ship AI systems.'];
    if(score>=48) return ['Builder','You can build, but several production decisions are still being made by intuition. Convert those gaps into repeatable engineering habits.'];
    if(score>=28) return ['Explorer','You know parts of the vocabulary, but the system-level failure and evaluation loop needs deliberate practice.'];
    return ['Beginner','Start with engineering foundations and small systems where every intermediate step can be inspected.'];
  }

  function renderMonitor(){
    const counts={}; Object.keys(dimensions).forEach(k=>counts[k]=0);
    state.answers.forEach((ans,i)=>{if(ans)counts[questions[i].d]++});
    $('#skillMonitor').innerHTML=Object.entries(dimensions).map(([k,v])=>{
      const total=questions.filter(q=>q.d===k).length, done=counts[k], pct=Math.round(done/total*100);
      return `<div class="monitor-row"><span>${esc(v.label)}</span><small>${done}/${total}</small><div class="mini-track"><i style="width:${pct}%"></i></div></div>`;
    }).join('');
  }

  function renderQuestion(animate=true){
    const item=questions[state.current], selected=state.answers[state.current]?.option;
    $('#diagDimension').textContent=dimensions[item.d].label;
    $('#progressText').textContent=`${state.current+1} / ${questions.length}`;
    $('#progressBar').style.width=`${((state.current+1)/questions.length)*100}%`;
    $('#backQuestion').disabled=state.current===0;
    const stage=$('#questionStage');
    stage.classList.remove('in');
    stage.innerHTML=`<h3>${esc(item.q)}</h3><div class="options">${item.a.map(([text],i)=>`<button class="option-btn ${selected===i?'selected':''}" type="button" data-option="${i}"><span class="option-key">${i+1}</span><span>${esc(text)}</span></button>`).join('')}</div>`;
    if(animate){void stage.offsetWidth;stage.classList.add('in')}
    $$('.option-btn',stage).forEach(btn=>btn.addEventListener('click',()=>choose(Number(btn.dataset.option))));
    renderMonitor();
  }

  function choose(option){
    const item=questions[state.current];
    state.answers[state.current]={option,score:item.a[option][1]};
    $$('.option-btn',$('#questionStage')).forEach((b,i)=>b.classList.toggle('selected',i===option));
    renderMonitor();
    setTimeout(()=>{
      if(state.current<questions.length-1){state.current++;renderQuestion();}
      else finishDiagnostic();
    },170);
  }

  function scores(){
    const raw={};Object.keys(dimensions).forEach(k=>raw[k]=[]);
    questions.forEach((q,i)=>raw[q.d].push(state.answers[i]?.score??0));
    const scored={};
    Object.entries(raw).forEach(([k,vals])=>scored[k]=Math.round(vals.reduce((a,b)=>a+b,0)/(vals.length*4)*100));
    const total=Math.round(Object.values(scored).reduce((a,b)=>a+b,0)/Object.keys(scored).length);
    return {total,scored};
  }

  function finishDiagnostic(){
    if(state.answers.some(x=>!x))return;
    const {total,scored}=scores(),[name,explanation]=level(total);
    const ordered=Object.entries(scored).sort((a,b)=>a[1]-b[1]), weakest=ordered[0], strongest=ordered.at(-1), weak=dimensions[weakest[0]];
    state.result={total,scored,name,weakest:weak.label};
    try{localStorage.setItem(STORAGE,JSON.stringify({...state.result,at:new Date().toISOString()}))}catch{}
    $('#diagCard').hidden=true;
    const result=$('#resultCard');
    result.hidden=false;
    result.innerHTML=`
      <div class="result-top">
        <div class="result-score"><div><strong>${total}</strong><small>/100</small></div></div>
        <div class="result-copy"><p class="eyebrow">Directional result</p><h3>${esc(name)}</h3><p>${esc(explanation)}</p></div>
      </div>
      <div class="result-bars">${Object.entries(scored).map(([k,v])=>`<div class="result-bar"><div class="result-bar-head"><b>${esc(dimensions[k].label)}</b><span>${v}</span></div><div class="bar-track"><i data-width="${v}"></i></div></div>`).join('')}</div>
      <div class="result-next"><small>Highest-leverage gap</small><b>${esc(weak.label)}</b><p>Your strongest area is ${esc(dimensions[strongest[0]].label)} (${strongest[1]}/100). Do not restart from zero. Attack the weakest system skill with an executable failure-and-eval loop.</p></div>
      <div class="result-actions"><a class="cta dark" href="course.html#/school/${weak.school}">Train this gap <span>→</span></a><button class="cta light" type="button" id="shareResult">Share result</button><button class="cta light" type="button" id="retakeResult">Retake</button></div>
      <p class="privacy-copy">Directional diagnostic only—not a hiring assessment, credential or certification.</p>`;
    requestAnimationFrame(()=>$$('.bar-track i',result).forEach(i=>i.style.width=i.dataset.width+'%'));
    $('#shareResult').onclick=shareResult;
    $('#retakeResult').onclick=resetDiagnostic;
  }

  function resetDiagnostic(){
    state.current=0;state.answers=Array(questions.length).fill(null);state.result=null;
    $('#resultCard').hidden=true;$('#diagCard').hidden=false;
    try{localStorage.removeItem(STORAGE)}catch{}
    renderQuestion(false);
  }

  $('#backQuestion').addEventListener('click',()=>{if(state.current>0){state.current--;renderQuestion()}});
  $('#resetDiagnostic').addEventListener('click',resetDiagnostic);

  function openApplication(){
    let r=state.result;
    if(!r){try{r=JSON.parse(localStorage.getItem(STORAGE)||'null')}catch{}}
    if(!r){setView('diagnostic');return}
    const title='[Founding Beta] AI Engineering Mastery application';
    const body=`## Founding Beta application\n\n**Diagnostic:** ${r.total}/100 — ${r.name}\n\n### Public application\nThis GitHub issue is public. Keep this application intentionally minimal.\n\n- [ ] I want to test the Founding Beta.\n- [ ] I can spend at least 4 focused hours/week.\n- [ ] I am comfortable giving blunt product feedback.\n\n### Optional\nIn one sentence, what kind of AI engineering skill do you most want to strengthen?\n\n> Do not include employer-confidential, customer, regulated, proprietary, private, contact, or identifying information. If selected, any deeper context can be requested separately through an appropriate private channel.`;
    window.open(`${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,'_blank','noopener');
  }
  $('#applyBtn').addEventListener('click',openApplication);

  async function shareResult(){
    const r=state.result;if(!r)return;
    const text=`AI Engineering diagnostic: ${r.total}/100 — ${r.name}. Biggest gap: ${r.weakest}. Evidence > eloquence.`;
    const url=`${location.origin}${location.pathname}#diagnostic`;
    try{if(navigator.share)await navigator.share({title:'My AI Engineering score',text,url});else{await navigator.clipboard.writeText(`${text} ${url}`);alert('Result copied.')}}catch(e){if(e?.name!=='AbortError')alert('Could not share automatically.');}
  }

  const dialog=$('#originDialog');
  function openOrigin(){if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','')}
  $('#originBtn').addEventListener('click',openOrigin);
  $('#originInline').addEventListener('click',openOrigin);
  $('#closeOrigin').addEventListener('click',()=>dialog.close?.());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close?.()});

  addEventListener('pointermove',e=>{
    const x=Math.round(e.clientX/innerWidth*100),y=Math.round(e.clientY/innerHeight*100);
    document.documentElement.style.setProperty('--mx',x+'%');document.documentElement.style.setProperty('--my',y+'%');
  },{passive:true});

  addEventListener('keydown',e=>{
    const panel=$('.panel.active')?.dataset.panel;
    if(panel==='diagnostic'&&!$('#diagCard').hidden&&/^[1-4]$/.test(e.key)){$(`.option-btn[data-option="${Number(e.key)-1}"]`)?.click();return}
    if(e.key==='Escape'&&dialog.open)dialog.close();
  });

  renderQuestion(false);
  setView(validViews.has(location.hash.slice(1))?location.hash.slice(1):'overview',false);
})();
