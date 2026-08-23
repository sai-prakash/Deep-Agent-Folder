import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.4/full/pyodide.mjs";
let pyReady=null; const py=()=>pyReady||(pyReady=loadPyodide());
async function runPython(code,tests){const p=await py();p.globals.set('USER_CODE',code);p.globals.set('USER_TESTS',tests||'');const out=await p.runPythonAsync(`
import io, contextlib, traceback, json
_buf=io.StringIO(); _ok=True; _err=''
try:
  with contextlib.redirect_stdout(_buf):
    exec(USER_CODE, globals())
    if USER_TESTS.strip(): exec(USER_TESTS, globals())
except Exception:
  _ok=False; _err=traceback.format_exc()
json.dumps({'ok':_ok,'output':_buf.getvalue()+(_err if _err else '')})
`);return JSON.parse(out)}
async function runSQL(code){const p=await py();p.globals.set('SQL_CODE',code);const out=await p.runPythonAsync(`
import sqlite3, json, traceback
con=sqlite3.connect(':memory:'); cur=con.cursor(); rows=[]; error=''
try:
  statements=[s.strip() for s in SQL_CODE.split(';') if s.strip()]
  for stmt in statements:
    cur.execute(stmt)
    if cur.description: rows.append({'columns':[d[0] for d in cur.description],'rows':cur.fetchall()})
  con.commit()
except Exception: error=traceback.format_exc()
json.dumps({'ok':not bool(error),'output': json.dumps(rows,indent=2)+('\\n'+error if error else '')})
`);return JSON.parse(out)}
function runJS(code,tests){let logs=[];const console={log:(...x)=>logs.push(x.map(v=>typeof v==='string'?v:JSON.stringify(v)).join(' '))};try{new Function('console',`${code}\n${tests||''}`)(console);return {ok:true,output:logs.join('\n')}}catch(e){return {ok:false,output:logs.join('\n')+'\n'+(e.stack||e.message),error:e.message}}}
self.onmessage=async e=>{const {id,language,code,tests}=e.data;try{let r;if(language==='python')r=await runPython(code,tests);else if(language==='sql')r=await runSQL(code);else r=runJS(code,tests);self.postMessage({id,...r,error:r.ok?'':r.output})}catch(err){self.postMessage({id,ok:false,error:err.stack||err.message})}};
