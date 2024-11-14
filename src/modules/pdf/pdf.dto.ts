import {t} from 'Elysia';

export interface uploadFilePdf {
    file: File;
}

export const uploadPdfDto = t.Object({
    file: t.File()
})