from pathlib import Path
import re,sys
bad=[]
secret_patterns=[r'sk-or-v1-[A-Za-z0-9_-]{20,}',r'sk-proj-[A-Za-z0-9_-]{20,}',r'ghp_[A-Za-z0-9]{20,}',r'github_pat_[A-Za-z0-9_]{20,}']
for p in Path('.').rglob('*'):
    if not p.is_file() or '.git' in p.parts: continue
    try: text=p.read_text(errors='ignore')
    except: continue
    for pat in secret_patterns:
        if re.search(pat,text): bad.append(f'{p}: potential committed secret')
app=Path('app.js').read_text()
if 'sessionStorage' not in app: bad.append('app.js: API key is not session-scoped')
if "Never paste secrets" not in app and 'Never submit secrets' not in app: bad.append('app.js: privacy warning missing')
worker=Path('workers/runtime-worker.mjs').read_text()
if "new Function" not in worker: pass
# Browser runner is intentionally isolated in a Worker. Reject dynamic eval in main app.
if re.search(r'\beval\s*\(',app) or 'new Function' in app: bad.append('app.js: dynamic code execution found in main UI thread')
if bad:
    print('\n'.join('SECURITY: '+x for x in bad)); sys.exit(1)
print('PASS: secret/privacy/runtime boundary audit')
