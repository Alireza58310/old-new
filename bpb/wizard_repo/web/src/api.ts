import Cloudflare, { Uploadable } from 'cloudflare';
import { randSubdomain } from './random';

export class CFAccount {
    readonly token: string;
    readonly id: string;
    readonly email: string;
    readonly client: Cloudflare;

    private constructor(token: string, client: Cloudflare, id: string, email: string) {
        this.token = token;
        this.client = client;
        this.id = id;
        this.email = email;
    }

    static async create(token: string): Promise<CFAccount> {
        const client = new Cloudflare({ apiToken: token });

        const response = await client.user.tokens.verify();
        if (response.status !== 'active') {
            throw new Error(`API token is ${response.status}.`)
        }

        const accounts = await client.accounts.list();

        // the account e-mail is the panel login name (and is written into the worker); "admin" only if the token cannot read it
        let email = 'admin';
        try {
            const user = await client.user.get();
            if (user.email) email = user.email.toLowerCase();
        } catch { }

        return new CFAccount(token, client, accounts.result[0].id, email);
    }

    // Small helper for plain REST calls (the SDK is only used where it already worked well)
    private async api(method: string, path: string, body?: unknown): Promise<any> {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.id}${path}`, {
            method,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        });

        const data = await res.json() as any;
        if (!res.ok || !data.success) {
            throw new Error(JSON.stringify(data.errors ?? data, null, 2));
        }

        return data.result;
    }

    async nameTaken(deployType: string, name: string): Promise<boolean> {
        try {
            if (deployType === "pages") {
                await this.client.pages.projects.get(name, {
                    account_id: this.id,
                });
            }

            await this.client.workers.scripts.get(name, {
                account_id: this.id,
            });

            return true;
        } catch (error) {
            return false;
        }
    }

    // D1 replaces the KV namespace. The panel creates its own tables on first request.
    async createD1Database(workerName: string, deployType: string): Promise<string> {
        const name = `${workerName}-${deployType}`.slice(0, 60);

        try {
            const db = await this.api('POST', '/d1/database', { name });
            return db.uuid as string;
        } catch (err) {
            throw new Error(`Error creating D1 database (does the token have "D1: Edit"?): ${err}`);
        }
    }

    async getWorkersDevSubdomain(): Promise<string> {
        const res = await this.client.workers.subdomains.get({
            account_id: this.id,
        });

        return `${res.subdomain}.workers.dev`;
    }

    async createWorkersDevSubdomain(): Promise<string> {
        const maxAttempts = 3;

        for (let i = 0; i < maxAttempts; i++) {
            try {
                const res = await this.client.workers.subdomains.update({
                    account_id: this.id,
                    subdomain: randSubdomain(),
                });

                return res.subdomain;
            } catch (err) {
                continue;
            }
        }

        throw new Error(`Failed to create a unique workers.dev subdomain after ${maxAttempts} attempts.`);
    }

    async deployWorker(name: string, script: Uploadable, databaseId: string) {
        // TS SDK has bugs for workers deployment - Uploading files
        const date = new Date().toISOString().split('T')[0];
        const metadata = {
            main_module: 'worker.js',
            compatibility_date: date,
            compatibility_flags: ['nodejs_compat'],
            bindings: [
                { type: 'd1', name: 'DB', id: databaseId }
            ]
        };

        const uploadForm = new FormData();
        uploadForm.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        uploadForm.append('worker.js', script as File, 'worker.js');

        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.id}/workers/scripts/${name}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${this.token}` },
            body: uploadForm
        });

        const data = await res.json() as any;
        if (!res.ok || !data.success) {
            throw new Error(`Error deploying worker: ${JSON.stringify(data.errors, null, 2)}`)
        }
    }

    async enableSubdomain(name: string) {
        await this.client.workers.scripts.subdomain.create(name, {
            account_id: this.id,
            enabled: true,
            previews_enabled: true,
        });
    }

    async createPagesProject(name: string, databaseId: string): Promise<string> {
        const date = new Date().toISOString().split('T')[0];

        const project = await this.api('POST', '/pages/projects', {
            name,
            production_branch: 'main',
            deployment_configs: {
                production: {
                    compatibility_date: date,
                    compatibility_flags: ['nodejs_compat'],
                    d1_databases: {
                        'DB': { id: databaseId }
                    }
                }
            }
        });

        return project.subdomain ?? '';
    }

    async deployPages(name: string, script: Uploadable) {
        await this.client.pages.projects.deployments.create(name, {
            account_id: this.id,
            branch: 'main',
            manifest: '{}',
            "_worker.js": script
        });
    }
}
