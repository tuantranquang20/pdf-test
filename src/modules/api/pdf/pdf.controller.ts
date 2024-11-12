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
        const folderName = crypto.randomUUID();
        const outputFolder= baseDir + '/' + folderName;
        const pdfPath = `${baseDir}${crypto.randomUUID()}.png`;
        await Bun.write(pdfPath, body.file);

        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }


        const options = {
            density: 500, // Độ phân giải ảnh
            savePath: outputFolder, // Thư mục lưu ảnh
            format: "png", // Định dạng ảnh (png, jpeg)
            width: 600, // Chiều rộng ảnh
            height: 800 // Chiều cao ảnh
        };
        const pdfToPic = pdf2pic.fromPath(pdfPath, options);



        // Lấy số trang từ file PDF
        const pdfBytes = await fs.promises.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        // Chuyển đổi từng trang PDF thành ảnh
        for (let page = 1; page <= totalPages; page++) {
            pdfToPic(page).then((result) => {
                console.log(`Trang ${page} đã được chuyển đổi: ${result}`);
            }).catch((error) => {
                console.error(`Lỗi khi chuyển đổi trang ${page}:`, error);
            });
        }

        return pdfPath
    }

    @Get('/view',  {response: {}})
    async view(ctx) {
        const indexPath = path.join(__dirname, 'src', 'index.html');
        return fs.readFileSync(indexPath, 'utf-8');
    }
}

const pdfService = new PdfService();

export default new PdfController(pdfService).start();