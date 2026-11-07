import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow=fs.readFileSync('.github/workflows/ui-regression.yml','utf8');
const trigger=workflow.split(/^permissions:/m)[0];
const push=trigger.match(/^  push:\s*\n([\s\S]*?)(?=^  [a-z_]+:|^permissions:)/m);
assert.ok(push,'Full UI/audio workflow must have a push trigger');
assert.match(push[1],/^    branches:\s*\[main\]\s*$/m);
assert.doesNotMatch(push[1],/^    (paths|paths-ignore):/m,
 'Pushes changing presets, helpers or docs must not skip main regression');
assert.match(trigger,/^  pull_request:\s*\n    branches:\s*\[main\]/m);
assert.match(trigger,/^  workflow_dispatch:/m);
for(const command of [
 'node tests/math-io.test.mjs',
 'node tests/root-angle-infographic.mjs',
 'node tests/orbital-hands-audio-sync.mjs',
 'node tests/audio-context-scheduler-proof.mjs',
 'node tests/transport-phase-continuity.mjs',
 'node tests/mandatory-voice-inventory.mjs',
 'node tests/all-presets-same-semantics.mjs',
 'node tests/accessibility-contrast.mjs',
 'node scripts/verify-ci-measurement-manifest.mjs'
]){
 assert.ok(workflow.includes(command),'Mandatory CI step missing: '+command);
}
assert.match(workflow,/uses:\s*actions\/upload-artifact@v4/);
console.log('PASS M11: all main pushes and PRs trigger complete browser/math/audio regression with real measurement artifacts');
