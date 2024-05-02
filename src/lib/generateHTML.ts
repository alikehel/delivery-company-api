import handlebars from "handlebars";
import { AppError } from "../lib/AppError";
import { Logger } from "../lib/logger";
import { localizeGovernorate, localizeOrderStatus } from "./localize";

export const generateHTML = async (template: string, data: object) => {
    try {
        handlebars.registerHelper("date", (date) => new Date(date).toLocaleDateString("en-GB"));
        handlebars.registerHelper("mapPhones", (phones) => {
            if (!phones) return "";
            if (typeof phones === "string") return phones;
            return phones.join("\n");
        });
        handlebars.registerHelper("inc", (value) => parseInt(value) + 1);
        handlebars.registerHelper("add", (v1, v2) => (parseInt(v1) || 0) + (parseInt(v2) || 0));
        handlebars.registerHelper("currency", (value) => {
            return Number(value || 0).toLocaleString("en-GB");
        });
        // handlebars.registerHelper("arabicNumber", (value) => {
        //     const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
        //     if (value === 0) {
        //         return "٠";
        //     }
        //     if (!value) return "";
        //     if (typeof value === "string") return value.replace(/[0-9]/g, (w) => arabicNumbers[+w]);
        //     return value.toString().replace(/[0-9]/g, (w: string) => arabicNumbers[+w]);
        // });
        handlebars.registerHelper("localizeOrderStatus", (status) => {
            return localizeOrderStatus(status);
        });
        handlebars.registerHelper("localizeGovernorate", (governorate) => {
            return localizeGovernorate(governorate);
        });

        const compiledTemplate = handlebars.compile(template, { strict: true });
        const html = compiledTemplate({
            ...data
        });

        return html;
    } catch (error) {
        Logger.error(error);
        throw new AppError("حدث خطأ أثناء انشاء ملف ال pdf", 500);
    }
};
