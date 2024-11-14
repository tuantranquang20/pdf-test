import {t} from 'Elysia';

export const createUser = t.Object({
    email: t.String({
        error: 'content is required with minimum length of 5',
        minLength: 5,
    }),
    password: t.String({
        error: 'content is required with minimum length of 5',
        minLength: 5,
    }),
})
