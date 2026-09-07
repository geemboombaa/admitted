#!/usr/bin/env bash
# claude-query wrapper: runs a nested `claude -p` with COST CAPTURE. Prompt on stdin, model = $1,
# extra flags passed through ($2+). Prints ONLY the assistant text to stdout (so callers parse it
# exactly like plain `claude -p`), and appends the per-call USD cost to COST.md.
# Usage:  printf '%s' "$PROMPT" | bash scripts/cq.sh claude-opus-4-8 --disallowedTools WebSearch
model="$1"; shift
prompt=$(cat)
json=$(printf '%s' "$prompt" | claude -p --model "$model" --output-format json "$@" 2>/dev/null)
printf '%s' "$json" | MODEL="$model" node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
  try{const j=JSON.parse(s);
    if(j.total_cost_usd!=null){
      const line="["+new Date().toISOString().replace(/\.\d+Z$/,"Z")+"] $"+(+j.total_cost_usd).toFixed(4)+" model="+process.env.MODEL+"\n";
      require("fs").appendFileSync("COST.md",line);
    }
    process.stdout.write(j.result||"");
  }catch(e){process.stdout.write(s);}  // fallback: emit raw so callers still see something
});'
