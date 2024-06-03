import { OrderStatus, SecondaryReportType } from "@prisma/client";
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
        handlebars.registerHelper("inc", (value) => Number.parseInt(value) + 1);
        handlebars.registerHelper("add", (v1, v2) => (Number.parseInt(v1) || 0) + (Number.parseInt(v2) || 0));
        handlebars.registerHelper("currency", (value) => {
            return Number(value || 0).toLocaleString("en-GB");
        });
        handlebars.registerHelper("colorizeRow", (status) => {
            if (
                status === OrderStatus.PARTIALLY_RETURNED ||
                status === OrderStatus.REPLACED ||
                status === OrderStatus.RETURNED
            ) {
                return "bg-red";
            }
            return "";
        });
        handlebars.registerHelper("colorizeRow2", (secondaryReportType, status) => {
            if (secondaryReportType === SecondaryReportType.RETURNED) {
                return "";
            }
            if (
                status === OrderStatus.PARTIALLY_RETURNED ||
                status === OrderStatus.REPLACED ||
                status === OrderStatus.RETURNED
            ) {
                return "bg-red";
            }
            return "";
        });
        handlebars.registerHelper("colorizeHeader", (secondaryReportType) => {
            if (secondaryReportType === SecondaryReportType.RETURNED) {
                return "bg-red";
            }
            return "bg-green";
        });
        handlebars.registerHelper("colorizeTitle", (secondaryReportType) => {
            if (secondaryReportType === SecondaryReportType.RETURNED) {
                return "red";
            }
            return "green";
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
