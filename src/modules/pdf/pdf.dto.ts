import {t} from 'elysia';

export interface uploadFilePdf {
    file: File;
}

export const uploadPdfDto = t.Object({
    file: t.File()
})