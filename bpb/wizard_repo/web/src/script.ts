import { toFile, Uploadable } from "cloudflare";
import { CFAccount } from "./api";
import { randCode, randString } from "./random";

interface Script {
    script: Uploadable;
    path: string;
}

// Our own build of the panel (BPB + Zeus, D1). Change this one line to point somewhere else.
export const WORKER_URL = 'https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/bbbb/worker.js';

export async function buildScript(
    account: CFAccount,
    workerName: string,
    subdomain: string,
    filename: string
): Promise<Script> {
    const pathCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456780-_';
    const passCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&*_-+;:,.';

    // cache-buster so a fresh commit is used immediately (raw.githubusercontent caches ~5 min otherwise)
    const res = await fetch(`${WORKER_URL}?t=${Date.now()}`, { headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) {
        throw new Error(`Failed to get panel script: status ${res.status} at ${res.url}`)
    }

    const script = await res.text();
    if (!script.startsWith('Object.assign(globalThis')) {
        throw new Error(`The downloaded file is not a panel build (${WORKER_URL}).`);
    }

    const buildTimestamp = new Date().toISOString();
    const randomCode = randCode();
    const path = randString(pathCharset, 12, 16);

    const embededSettings = {
        accID: account.id,
        accEmail: account.email,
        apiToken: account.token,
        vlUUID: crypto.randomUUID(),
        trPass: randString(passCharset, 16, 20),
        securePath: path,
        proxyIpMode: 'proxyip',
        proxyIPs: [],
        prefixes: [],
        fallback: '',
        dohUrl: '',
        mainDomain: `${workerName}.${subdomain}`
    };

    const worker = [
        `// ${account.email}`,
        `// Build: ${buildTimestamp}`,
        '// @ts-nocheck',
        `${randomCode}const EMBEDED_SETTINGS = ${JSON.stringify(embededSettings)};${script}`
    ].join('\n');

    const file = new TextEncoder().encode(worker);
    const uploadable: Uploadable = await toFile(file, filename, {
        type: 'application/javascript+module',
    });

    return {
        script: uploadable,
        path: path
    }
}
