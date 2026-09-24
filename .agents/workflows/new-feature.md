---
description: Scaffold a new feature module end to end — invokes build-feature-module, runs a fast automatic sanity check, then stops for human review before anything is committed.
---


1. Confirm the feature name and domain verbs with the user if not already
   provided in the request.
2. Invoke the build-feature-module skill to generate the five files, one at
   a time, pausing for explicit approval after each file exactly as that
   skill specifies. Do not skip or batch this step.
// turbo
3. Once all five files are approved, run `npm run lint` in the frontend
   directory and report any errors found. This step is read-only — it does
   not modify any file — so it runs automatically without a confirmation
   prompt.
// turbo
4. Run `git status` and report exactly which files changed. This step is
   also read-only and runs automatically.
5. Stop here. Do not stage or commit anything. Hand control back to the user
   to review the diff and run the commit protocol from the master playbook
   manually, one file at a time, with the Assisted-by trailer.

Note on the two turbo steps above: they are marked to auto-run ONLY because
neither one writes to a file or the repository. Nothing in this workflow
should ever be marked turbo if it creates, edits, stages, or commits
anything — that boundary is what keeps this workflow compliant with the
human-in-the-loop rule in GEMINI.md. If you copy this workflow as a template
for a new one, preserve that boundary.