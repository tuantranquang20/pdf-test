import {BaseController, Post} from "@utils/index";
import PdfService from "./pdf.service";
import {uploadFilePdf, uploadPdfDto} from "./pdf.dto";
import pdf2pic from 'pdf2pic';
import fs from 'fs';
import {PDFDocument} from 'pdf-lib';
import path from 'path';
import crypto from 'crypto';
import {AuthGuard} from "@middlewares/index";

type Image = {
    name: string;
    size: string;
    filesize: number;
    path: string;
    page: number;
};

type Images = Array<Image>;

class PdfController extends BaseController {
    routes = [];

    constructor(public service: PdfService) {
        super('/pdf');
    }

    @Post('/upload', {
        response: {},
        beforeHandle: AuthGuard,
    })
    async upload({body}: { body: uploadFilePdf }) {
        try {
            const baseDir = "public/storage/";
            const folderName = crypto.randomUUID();
            const outputDir = path.join(process.cwd(), baseDir, folderName);
            const pdfPath = path.join(baseDir, `${crypto.randomUUID()}.png`);

            // Write the uploaded file to the specified path
            await Bun.write(pdfPath, body.file);

            // Create output directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }

            const options = {
                density: 1000, // Image density
                savePath: outputDir, // Directory to save images
                format: "png", // Image format (png, jpeg)
                width: 1200, // Image width
                height: 1600 // Image height
            };
            const pdfToPic = pdf2pic.fromPath(pdfPath, options);

            // Load the PDF document and get the total number of pages
            const pdfBytes = await fs.promises.readFile(pdfPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const totalPages = pdfDoc.getPageCount();

            // Convert each PDF page to an image
            const conversionPromises = Array.from({length: totalPages}, (_, page) => {
                return pdfToPic(page + 1).then((result) => {
                    console.log(`Page ${page + 1} converted:`, result);
                    return {...result, path: `/public/storage/${folderName}/${result.name}`};
                }).catch((error) => {
                    console.error(`Error converting page ${page + 1}:`, error);
                    return null; // Handle conversion errors gracefully
                });
            });

            const results: Images = (await Promise.all(conversionPromises)).filter(Boolean);
            return {message: results};
        } catch (error) {
            console.error('Error in PDF upload:', error);
            return {error: 'An error occurred while processing the PDF.'};
        }
    }
}

const pdfService = new PdfService();
export default new PdfController(pdfService).start();