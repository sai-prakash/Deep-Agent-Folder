(() => {
const trade={
 S0:'Prefer explicit, reproducible contracts over convenience abstractions; add complexity only when it removes a measured failure.',
 S1:'Choose the smallest model/context/control configuration that clears the task threshold; more tokens or capability can raise cost and variance.',
 S2:'Optimize evidence recall and trust before generation polish; every extra retrieval stage must earn its latency and operational complexity.',
 S3:'Delegate only decisions that benefit from model adaptability; keep permissions, invariants and irreversible side effects deterministic.',
 S4:'Spend evaluator cost where uncertainty matters; exact properties belong to code, semantic properties need calibrated judges or humans.',
 S5:'Optimize for successful, safe user outcomes under tail conditions—not average demo quality; risk sets the strength of controls.',
 S6:'Prefer data/metric changes that address the diagnosed error before increasing model capacity; evaluate on untouched data.',
 S7:'Use the simplest integrated architecture that meets explicit quality, cost, latency, security and governance thresholds.'};
const basePrereq=['Comfort reading small Python/JavaScript examples','Understand baseline → experiment → measurement'];
function makeLesson(x,school){
 const topic=x.title.toLowerCase(), project=/Project|Capstone/.test(x.title), rule=trade[school.id];
 const objectives=[
  `Explain the causal mechanism behind ${topic}, including what remains deterministic around model/data uncertainty.`,
  `Build or inspect a minimal baseline and expose the intermediate evidence needed to debug ${topic}.`,
  `Reproduce the lesson's target failure and quantify it: ${x.measure}`,
  `Choose the next experiment from observed evidence and defend a simpler alternative.`];
 const workedExample={
  situation:`A production-minded team is applying ${topic} to this goal: ${x.summary} They need evidence that the design works beyond a happy-path demo.`,
  naive:`The first implementation follows the obvious path but omits the lesson's hardest condition: ${x.breakIt} It appears correct until that condition is exercised.`,
  diagnosis:x.observe,
  intervention:x.guided,
  evidence:`Use the same baseline and failure cases after the intervention. ${x.measure} If the target improves while a critical guardrail regresses, the change is not a clean win.`};
 const deepDive={diagnostic:x.observe,decisionRule:rule,failureQuestion:`What would have to be true for this failure to occur: ${x.breakIt}`,evidenceQuestion:`Which observation would falsify your diagnosis before you change ${topic}?`};
 return {id:x.id,schoolId:school.id,title:x.title,minutes:x.minutes,summary:x.summary,objectives,prerequisites:x.prereq||basePrereq,
  mechanism:x.core,mentalModel:`Draw ${topic} as a data/control flow, then mark the observable named in this lesson: ${x.observe} The diagram should make clear what is learned/probabilistic, what is deterministic, and where an unsafe or incorrect result is stopped.`,deepDive,workedExample,
  misconceptions:[`Knowing the definition of ${x.title} is not evidence that you can engineer it.`,`A stronger model is not automatically the highest-leverage fix for a ${topic} failure.`,`A successful happy-path demo does not justify removing the failure from the regression set.`],
  terms:x.terms,predict:`Before changing anything, predict exactly how the naive version will fail: ${x.breakIt} State the trace or metric that would prove your prediction wrong.`,
  guided:x.guided,builder:`Build the smallest independently designed ${topic} baseline that can be evaluated on a normal case, edge case and adversarial/failure case. Record why you chose its representation and boundary.`,
  engineer:`You inherit a production complaint involving ${topic} with no reliable root-cause label. Localize the earliest divergence from evidence, create an error taxonomy, change one primary mechanism, rerun the eval and propose the next experiment.`,
  breakIt:x.breakIt,measure:x.measure,improve:`Use this diagnostic rule: ${x.observe} Change the smallest mechanism that explains the largest consequential failure, rerun the identical cases, and apply this trade-off: ${rule}`,
  explain:`Explain ${topic} as mechanism → concrete failure → observable evidence → intervention → trade-off. Then name a case where a simpler system is preferable.`,
  recall:[`What is the uncertain component in ${topic}, and what should remain deterministic around it?`,`Name a realistic failure that a happy-path demo of ${topic} would miss.`,`Which measurement would tell you whether your intervention actually improved ${topic}?`],
  scenario:{prompt:`A critical slice now fails under this condition: ${x.breakIt} You may change one primary variable before the next evaluation run. What do you inspect first, what do you change, and what evidence would make you revert?`,rubric:['Locates the earliest observable divergence','Changes one primary variable','Uses identical baseline cases for comparison','Checks a critical regression slice','States a falsifiable rollback condition']},
  lab:x.lab,mastery:{threshold:4,dimensions:[{name:'Causal model',question:'Can the learner explain why the behavior happens, not just name the technique?'},{name:'Reproducibility',question:'Is there a runnable artifact, trace, dataset or verifiable GitHub implementation?'},{name:'Failure analysis',question:'Did the learner reproduce and correctly localize a meaningful failure?'},{name:'Measurement',question:'Is there credible baseline/before-after evidence on representative cases?'},{name:'Judgment',question:'Can the learner defend the next experiment and a simpler alternative?'}]},references:x.refs};
}
const RAW=window.COURSE_V2_RAW;
const schools=RAW.schools.map(s=>({...s,lessons:s.lessons.map(x=>makeLesson(x,s))}));
window.COURSE_V2={meta:RAW.meta,schools};
})();
