import Elysia from 'elysia';
import {PdfController, AuthController, UserController} from "@modules/";

export function registerControllers(app: Elysia) {
    app.use(PdfController)
    app.use(AuthController)
    app.use(UserController)
}