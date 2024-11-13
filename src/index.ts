import {Elysia} from "elysia";
import cors from '@elysiajs/cors';
import bearer from '@elysiajs/bearer';
import swagger from '@elysiajs/swagger';
import {registerControllers} from './server';
import {
    ErrorMessages,
    gracefulShutdown,
    bootLogger,
} from './utils';
import {logger} from "@tqman/nice-logger";

import {createElement} from "react";
import App from './react/App'
import {renderToReadableStream} from 'react-dom/server.browser'
import fs from "fs";
import path from "path";

await Bun.build({
    entrypoints: ['./src/react/index.tsx'],
    outdir: './public',
});

try {
    const app = new Elysia()
        .use(cors())
        .use(swagger())
        .use(bearer())
        .use(logger({
            mode: "live", // "live" or "combined" (default: "combined")
        }))
        .onStop(gracefulShutdown)
        .onError(({code, error, set}) => ErrorMessages(code, error, set))
        .get('/public/*', (ctx) => {
            const filePath = path.join(process.cwd(), 'public', ctx.params['*']);
            if (fs.existsSync(filePath)) {
                return new Response(fs.readFileSync(filePath), {
                    headers: {
                        'Content-Type': getContentType(filePath), // Set appropriate content type
                    },
                });
            } else {
                return new Response('File not found', { status: 404 });
            }
        })
        .get('/', async () => {
            // create our react App component
            const app = createElement(App)
            const stream = await renderToReadableStream(app, {
                bootstrapScripts: ['/public/index.js']
            })
            return new Response(stream, {
                headers: {'Content-Type': 'text/html'}
            })
        })

    const getContentType = (filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.txt': 'text/plain',
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.mp4': 'video/mp4',
            // Thêm định dạng khác nếu cần
        };

        return mimeTypes[ext] || 'application/octet-stream'; // Fallback cho các loại không xác đ
    };

    // user routes and middlewates
    registerControllers(app);
    process.on('SIGINT', app.stop);
    process.on('SIGTERM', app.stop);
    app.listen(process.env.PORT!, bootLogger);
} catch (e) {
    console.log('error booting the server');
    console.error(e);
}
