# Self-improve loop — what this actually is, honestly

## What was verified vs. what wasn't

Built and confirmed from the Cowork device bridge, 2026-09-06:
- `node scripts/validate.js` and `node scripts/build.js` both run and pass against the current repo (baseline: 101 school files, 0 validation errors).
- `scripts/self-improve-backlog.js` (`next` / `done`) runs correctly against the real seeded backlog.
- `scripts/self-improve-loop.sh` passes `bash -n` syntax checking.

NOT verified, because the environment this was built from won't allow it:
- The bridge's own `claude` binary (`/opt/cowork/claude-bin/claude`) returned `claude is not enabled in this environment` on a plain test call. So neither the build step nor the independent-review step of the loop has ever actually been run end to end by whoever wrote this.
- Separately, this bridge sandboxes every shell call to die when the call ends (`bwrap --die-with-parent`) — confirmed by starting a background process and finding it gone on the next call. So even if `claude -p` worked here, nothing could run continuously in the background from this bridge. That's not this script's problem (it's a foreground loop, not a daemon) but it does mean this bridge can never be the thing that runs it unattended.

**Practical upshot: run this from your own terminal** (PowerShell/WSL/Git Bash on your actual machine, wherever your own `claude` CLI works normally), not through Cowork. Smoke-test it on one throwaway/low-stakes backlog item first, since the loop logic itself hasn't been run for real yet.

## What it does

One iteration:
1. Pulls the next `- [ ] ...` item from `SELF-IMPROVE-BACKLOG.md`.
2. `claude -p` implements exactly that one item (edits `data/schools/*.json`, never `index1.html` directly).
3. `node scripts/validate.js` gates it — objective pass/fail, not the build step's own opinion of itself.
4. `node scripts/build.js --out=index1.generated.html` regenerates the app; rejected if that fails or comes out empty.
5. A **second, independent** `claude -p` call — no memory of step 2, given `.claude/agents/adversarial-reviewer.md` as its brief — reviews the diff cold and must reply `APPROVE` or `REJECT`.
6. Only if 3, 4, and 5 all pass: the backlog item is marked done and committed. Any failure at any step: `git reset --hard` back to the pre-iteration commit, logged to `SELF-IMPROVE-LOG.md`, move to the next item.

Nothing is ever pushed to `origin` (and therefore never deployed — Vercel deploys on push to `main`) unless you pass `--push` explicitly, every run.

## Usage

    ./scripts/self-improve-loop.sh                  # one iteration
    ./scripts/self-improve-loop.sh --iterations=5    # up to 5 back-to-back
    ./scripts/self-improve-loop.sh --push            # also push (deploys) after a successful commit

Requires a clean working tree to start (it refuses otherwise, rather than mixing your uncommitted work into its own revert logic).

## What "self-correcting, self-improving" means here, precisely

Correcting: every change is gated by a real test (`validate.js`) and a second, independent model call before it's accepted — not the same context that wrote it grading its own work. Improving: it works down a real backlog of researched-but-unmerged items on its own once you start it. Autonomous only in the sense of "runs several iterations unattended once started" — it is not a standing background service; something (you, or a scheduled task that opens a session and runs this script) has to start each run. See the parent conversation for why a true always-on background daemon isn't possible through the Cowork bridge, and for the scheduled-task alternative if you want it to start itself on a timer.
