import puppeteer from "puppeteer";
import { AppError } from "./AppError";
import { Logger } from "./logger";

// html and css content or html and css file path

export const generatePDF = async (html: string, css?: string) => {
    try {
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            ignoreDefaultArgs: ["--disable-extensions"]
        });
        const page = await browser.newPage();

        await page.emulateMediaType("print");
        await page.setContent(html);
        css && (await page.addStyleTag({ content: css }));

        const pdf = await page.pdf({
            format: "a4",
            landscape: true,
            printBackground: true,
            margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" }
        });

        await browser.close();
        return pdf;
        // return Buffer.from(Object.values(pdf));
    } catch (error) {
        Logger.error(error);
        throw new AppError("حدث خطأ أثناء انشاء ملف ال pdf", 500);
    }
};
