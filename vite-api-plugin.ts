import { existsSync } from 'node:fs';
import path from 'node:path';
import type { IncomingMessage } from 'node:http';
import type { Plugin, ViteDevServer } from 'vite';

type Vars = Record<string, string>;

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk as Buffer));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

/**
 * توابع پوشهٔ api/ را در حین `npm run dev` اجرا می‌کند تا نیازی به Vercel CLI نباشد.
 */
export function devApi(env: Vars): Plugin {
  return {
    name: 'attendance-dev-api',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }

      server.middlewares.use('/api', async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const route = url.pathname.replace(/^\/+/, '').split('/')[0];
        if (!route) return next();

        const file = path.resolve(server.config.root, 'api', `${route}.ts`);
        if (!existsSync(file)) return next();

        try {
          const body =
            req.method === 'GET' || req.method === 'HEAD' ? undefined : await readJson(req);
          const mod = await server.ssrLoadModule(`/api/${route}.ts`);
          await mod.default(
            {
              method: req.method,
              body,
              query: Object.fromEntries(url.searchParams),
              headers: req.headers,
            },
            res,
          );
        } catch (error) {
          server.config.logger.error(`[api] ${route}: ${String(error)}`);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json; charset=utf-8');
          }
          res.end(JSON.stringify({ error: 'server_error' }));
        }
      });
    },
  };
}
