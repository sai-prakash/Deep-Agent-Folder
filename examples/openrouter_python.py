import os, requests
key=os.environ["OPENROUTER_API_KEY"]
r=requests.post("https://openrouter.ai/api/v1/chat/completions",headers={"Authorization":f"Bearer {key}","Content-Type":"application/json","X-Title":"AI Engineering Mastery Lab"},json={"model":"stealth/ox-alpha","messages":[{"role":"user","content":"Explain one failure mode of naive vector search in two sentences."}]},timeout=60)
r.raise_for_status(); print(r.json()["choices"][0]["message"]["content"])
