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
