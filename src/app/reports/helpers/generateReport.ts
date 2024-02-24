import { ReportType } from "@prisma/client";
import fs from "fs";
import path from "path";
import { AppError } from "../../..//lib/AppError";
import { generateHTML } from "../../..//lib/generateHTML";
import { generatePDF } from "../../..//lib/generatePDF";
import { orderReform } from "../../../app/orders/orders.dto";
import { Logger } from "../../../lib/logger";
import { reportReform } from "../reports.dto";

export const generateReport = async (
    reportType: ReportType,
    reportData: ReturnType<typeof reportReform>,
    orders: ReturnType<typeof orderReform>[]
) => {
    try {
        let templatePath = "";
        if (reportType === "CLIENT") {
            templatePath = path.join(__dirname, "../../../../static/templates/clientReport.hbs");
        } else if (reportType === "BRANCH") {
            templatePath = path.join(__dirname, "../../../../static/templates/branchReport.hbs");
        } else if (reportType === "COMPANY") {
            templatePath = path.join(__dirname, "../../../../static/templates/companyReport.hbs");
        } else if (reportType === "DELIVERY_AGENT") {
            templatePath = path.join(__dirname, "../../../../static/templates/deliveryAgentReport.hbs");
        } else if (reportType === "GOVERNORATE") {
            templatePath = path.join(__dirname, "../../../../static/templates/governorateReport.hbs");
        } else if (reportType === "REPOSITORY") {
            templatePath = path.join(__dirname, "../../../../static/templates/repositoryReport.hbs");
        } else {
            throw new Error("لا يوجد قالب لهذا التقرير");
        }

        // TODO: replace with async
        const template = fs.readFileSync(templatePath, "utf8");
        const css = fs.readFileSync(
            path.join(__dirname, "../../../../static/styles/reportStyle.css"),
            "utf8"
        );

        const html = await generateHTML(template, { reportData, orders });
        const pdf = await generatePDF(html, css);

        return pdf;
    } catch (error) {
        Logger.error(error);
        throw new AppError("حدث خطأ أثناء انشاء ملف ال pdf", 500);
    }
};
