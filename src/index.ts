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
            const filePath = path.join(__dirname, 'src', ctx.path.replace('/public/', ''));
            return fs.readFileSync(filePath);
        })

    // user routes and middlewates
    registerControllers(app);
    process.on('SIGINT', app.stop);
    process.on('SIGTERM', app.stop);
    app.listen(process.env.PORT!, bootLogger);
} catch (e) {
    console.log('error booting the server');
    console.error(e);
}