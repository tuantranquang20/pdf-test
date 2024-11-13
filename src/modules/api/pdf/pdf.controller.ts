import {BaseController, Get, Post} from "../../../utils";
import PdfService from "./pdf.service";
import {uploadFilePdf} from "./pdf.dto";
import pdf2pic from 'pdf2pic';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import path from 'path';


class PdfController extends BaseController {
    routes = [];

    constructor(public service: PdfService) {
        super('/pdf');
    }

    @Post('/upload', {response: {}})
    async show({body}: { body: uploadFilePdf }) {
        const baseDir = "public/storage/";
        const pdfPath = `${baseDir}${crypto.randomUUID()}.pdf`;
        await Bun.write(pdfPath, body.file);
        const folderName = crypto.randomUUID()
        const outputDir = path.join(process.cwd(), `public/storage/${folderName}`);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        // Load the PDF document to get the page count
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const numPages = pdfDoc.getPageCount();

        const options = {
            density: 1000,
            savePath: outputDir,
            format: 'png',
            width: 600,
            height: 800,
        };

        const pdfToPic = fromPath(pdfPath, options);
        const promises = [];
        for (let i = 1; i <= numPages; i++) {
            promises.push(
                pdfToPic(i).then((resolve) => {
                    console.log(`Page ${i} converted to image:`, resolve);
                    return resolve; // Return the resolve to store or log later
                }).catch((e) => {
                    console.error(`Error converting page ${i}:`, e);
                })
            );
        }

        let results: images = await Promise.all(promises)

        results.map((image: image) => {
            image.path = `/public/storage/${folderName}/${image.name}`;
            return image;
        })

       return { message: results };
    }

    @Get('/view',  {response: {}})
    async view(ctx) {
        const indexPath = path.join(__dirname, 'src', 'index.html');
        return fs.readFileSync(indexPath, 'utf-8');
    }
}

const pdfService = new PdfService();

export default new PdfController(pdfService).start();
