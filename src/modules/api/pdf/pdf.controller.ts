import {BaseController, Get, Post} from "../../../utils";
import PdfService from "./pdf.service";
import {uploadFilePdf} from "./pdf.dto";
import pdf2pic from 'pdf2pic';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import path from 'path';

type image = {
    name: string,
    size: string,
    filesize: number,
    path: string,
    page: number,
}

type images = Array<image>

class PdfController extends BaseController {
    routes = [];

    constructor(public service: PdfService) {
        super('/pdf');
    }

    @Post('/upload', {response: {}})
     async show({body}: { body: uploadFilePdf }) {
            try{
                const baseDir = "public/storage/";
                const folderName = crypto.randomUUID();
                const outputDir = path.join(process.cwd(), `public/storage/${folderName}`);
                const pdfPath = `${baseDir}${crypto.randomUUID()}.png`;
                await Bun.write(pdfPath, body.file);
    
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
    
    
                const options = {
                    density: 500, // Độ phân giải ảnh
                    savePath: outputDir, // Thư mục lưu ảnh
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
                const promises = [];
                for (let page = 1; page <= totalPages; page++) {
                    promises.push(
                        pdfToPic(page).then((result) => {
                            console.log(`Trang ${page} đã được chuyển đổi: ${result}`);
                        }).catch((error) => {
                            console.error(`Lỗi khi chuyển đổi trang ${page}:`, error);
                        })
                    );
                }
    
                const results: images = await Promise.all(promises);
                results.map((image: image) => {
                    image.path = `${outputDir}/${image.name}`;
                    return image;
                })
                return { message: results };
            }catch (e){
                console.log(e)
                return {};
            }
     }

    @Get('/view',  {response: {}})
    async view(ctx) {
        const indexPath = path.join(__dirname, 'src', 'index.html');
        return fs.readFileSync(indexPath, 'utf-8');
    }
}

const pdfService = new PdfService();

export default new PdfController(pdfService).start();
