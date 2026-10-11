#!/bin/sh
# Needs node >= 22. Runs the worker against a fake D1 (node:sqlite) and a fake network.
cd "$(dirname "$0")"
sed 's#from"cloudflare:sockets"#from"./sockets-stub.mjs"#g' ../../worker.js > w.mjs
echo ';globalThis.__zT={__zPickProxy};' >> w.mjs
node --no-warnings e2e.mjs 2>&1 | grep -E "^(PASS|FAIL|ALL|SOME)"
node --no-warnings auth.mjs 2>&1 | grep -E "^(normal|uuid|update|zeus state)"
node --no-warnings boot.mjs 2>&1 | grep -E "^(PASS|FAIL|ALL|SOME)"
rm -f w.mjs
