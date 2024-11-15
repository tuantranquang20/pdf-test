import {Elysia} from "elysia";
import cors from '@elysiajs/cors';
import bearer from '@elysiajs/bearer';
import swagger from '@elysiajs/swagger';
import {registerControllers} from './server';
import {ErrorMessages, gracefulShutdown, bootLogger} from './utils';
import {logger} from "@tqman/nice-logger";
import {createElement} from "react";
import App from './react/App';
import {renderToReadableStream} from 'react-dom/server.browser';
import fs from "fs";
import path from "path";
import PrismaService from "../prisma/prisma.service";
import {jwt} from '@elysiajs/jwt'



// Helper function to determine content type
const getContentType = (filePath: string): string => {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
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
        // Add other formats as needed
    };

    return mimeTypes[ext] || 'application/octet-stream'; // Fallback for unknown types
};

try {

    const app = new Elysia()
        .use(cors())
        .use(swagger())
        .use(bearer())
        .use(logger({mode: "live"}))
        .use(
            jwt({
                name: 'jwt',
                secret: 'MY_SECRETS',
                exp: "1w"
            })
        )
        .onStop(async () => {
            await PrismaService.$disconnect();
            console.log('Disconnected from the database.');
            return gracefulShutdown
        })
        .onError(async ({code, error, set}) => {
            await PrismaService.$disconnect();
            return ErrorMessages(code, error, set)
        })

        // Serve static files
        .get('/public/*', (ctx) => {
            const filePath = path.join(process.cwd(), 'public', ctx.params['*']);
            if (fs.existsSync(filePath)) {
                return new Response(fs.readFileSync(filePath), {
                    headers: {
                        'Content-Type': getContentType(filePath),
                    },
                });
            }
            return new Response('File not found', {status: 404});
        })

        // Serve the main React application
        // .get('/', async () => {
        //     const appElement = createElement(App);
        //     const stream = await renderToReadableStream(appElement, {
        //         bootstrapScripts: ['/public/index.js'],
        //     });
        //     return new Response(stream, {
        //         headers: {'Content-Type': 'text/html'},
        //     });
        // });

    // Register user routes and middleware
    registerControllers(app);

    // Handle graceful shutdown
    const shutdown = () => {
        app.stop();
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Start the server
    app.listen(process.env.PORT!, bootLogger);
} catch (error) {
    console.error('Error booting the server:', error);
}