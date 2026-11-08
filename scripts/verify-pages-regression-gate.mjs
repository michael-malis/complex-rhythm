import assert from 'node:assert/strict';
import fs from 'node:fs';

const pages=fs.readFileSync('.github/workflows/pages.yml','utf8');
const ui=fs.readFileSync('.github/workflows/ui-regression.yml','utf8');
const triggers=pages.split(/^permissions:/m)[0];
const regressionName=ui.match(/^name:\s*(.+)$/m)?.[1]?.trim();
assert.equal(regressionName,'Rhythm Studio UI regression',
 'Pages gate must refer to the actual full-regression workflow name');
assert.match(triggers,/^  workflow_run:\s*$/m);
assert.match(triggers,/^    workflows:\s*\["Rhythm Studio UI regression"\]/m);
assert.match(triggers,/^    types:\s*\[completed\]/m);
assert.match(triggers,/^    branches:\s*\[main\]/m);
assert.doesNotMatch(triggers,/^  (push|pull_request|workflow_dispatch|schedule):/m,
 'Pages must not have a bypass trigger');
const job=pages.match(/^  deploy:\s*\n    if:\s*(.+)$/m)?.[1]||'';
for(const condition of [
 "github.event.workflow_run.conclusion == 'success'",
 "github.event.workflow_run.event == 'push'",
 "github.event.workflow_run.head_branch == 'main'",
 "github.event.workflow_run.head_repository.full_name == github.repository"
])assert.ok(job.includes(condition),'Pages deployment missing condition: '+condition);
assert.match(pages,/^      - uses: actions\/checkout@v4\s*\n        if: steps.revision.outputs.is_current == 'true'\s*\n        with:\s*\n          ref: \$\{\{ github.event.workflow_run.head_sha \}\}/m,
 'Must check out the same commit that passed full CI, not the default branch');
assert.match(pages,/^      - id: deployment\s*\n        if: steps.final_revision.outputs.is_current == 'true'\s*\n        uses: actions\/deploy-pages@v4/m,
 'Deploy must depend on the final live main-SHA guard');
assert.equal((pages.match(/gh api "repos\/\$\{GITHUB_REPOSITORY\}\/git\/ref\/heads\/main"/g)||[]).length,2,
 'Require main-HEAD checks before and after packaging Pages artifact');
for(const action of ['actions/configure-pages@v5','actions/upload-pages-artifact@v4'])
 assert.ok(pages.includes(action),'Missing required Pages action '+action);
const registry=fs.readFileSync('.github/workflows/outcome-quality.yml','utf8');
assert.ok(registry.includes('node scripts/verify-pages-regression-gate.mjs'),
 'Independent registry CI must enforce the release invariant');
assert.equal((registry.match(/- \.github\/workflows\/pages.yml/g)||[]).length,2,
 'Changes to pages.yml must trigger the independent registry gate on PR and main');
console.log('PASS M01/M11: Pages deploy is restricted to successful main push regression, same tested SHA, and latest main HEAD; no direct publish bypass');
