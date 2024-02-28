import fs from "fs";
import path from "path";
import { AppError } from "../../..//lib/AppError";
import { generateHTML } from "../../..//lib/generateHTML";
import { generatePDF } from "../../..//lib/generatePDF";
import { orderReform } from "../../../app/orders/orders.dto";
import { Logger } from "../../../lib/logger";

export const generateReceipts = async (orders: ReturnType<typeof orderReform>[]) => {
    try {
        const templatePath = path.join(__dirname, "../../../../static/templates/receipt.hbs");

        // TODO: replace with async
        const template = fs.readFileSync(templatePath, "utf8");
        const css = fs.readFileSync(
            path.join(__dirname, "../../../../static/styles/receiptStyle.css"),
            "utf8"
        );

        const html = await generateHTML(template, { orders });
        const pdf = await generatePDF(html, css, { landscape: false });

        return pdf;
    } catch (error) {
        Logger.error(error);
        throw new AppError("حدث خطأ أثناء انشاء ملف ال pdf", 500);
    }
};
