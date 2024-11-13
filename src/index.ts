import { Elysia } from "elysia";
import cors from '@elysiajs/cors';
import bearer from '@elysiajs/bearer';
import swagger from '@elysiajs/swagger';
import { registerControllers } from './server';
import {
    ErrorMessages,
    gracefulShutdown,
    requestLogger,
    bootLogger,
} from './utils';
import path from 'path';
import fs from 'fs';

try {
    const app = new Elysia()
        .use(cors())
        .use(swagger())
        .use(bearer())
        .onStop(gracefulShutdown)
        .onError(({ code, error, set }) => ErrorMessages(code, error, set))
        .get('/', (ctx) => {
            const indexPath = path.join(__dirname, 'src', 'index.html');
            return fs.readFileSync(indexPath, 'utf-8');
        })
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
        });

    const getContentType = (filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                return 'image/jpeg';
            case '.png':
                return 'image/png';
            case '.gif':
                return 'image/gif';
            case '.svg':
                return 'image/svg+xml';
            case '.pdf':
                return 'application/pdf';
            default:
                return 'application/octet-stream'; // Fallback for unknown types
        }
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
