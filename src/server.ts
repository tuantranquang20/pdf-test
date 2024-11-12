import Elysia from 'elysia';
import {PdfController} from "./modules";

export function registerControllers(app: Elysia) {
    app.use(PdfController)
}