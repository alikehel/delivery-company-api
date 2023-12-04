// import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { ReportModel } from "./report.model";
import { ReportService } from "./reports.service";
import { ReportCreateSchema, ReportUpdateSchema } from "./reports.zod";

const reportModel = new ReportModel();
const reportService = new ReportService();

export class ReportController {
    createReport = catchAsync(async (req, res) => {
        const reportData = ReportCreateSchema.parse(req.body);
        const companyID = +res.locals.user.companyID;
        const loggedInUserID = res.locals.user.id ?? +res.locals.user.id;

        const pdf = await reportService.createReport(companyID, {
            loggedInUserID,
            reportData
        });

        const chunks: Uint8Array[] = [];
        let result;

        pdf.on("data", function (chunk) {
            chunks.push(chunk);
        });

        pdf.on("end", function () {
            result = Buffer.concat(chunks);
            res.contentType("application/pdf");
            res.send(result);
        });

        pdf.end();

        // res.status(200).json({
        //     status: "success",
        //     data: createdReport
        // });
    });

    getAllReports = catchAsync(async (req, res) => {
        const queryString = req.query;

        const { page, pagesCount, reports } = await reportService.getAllReports(
            {
                queryString: queryString
            }
        );

        if (pagesCount === 0) {
            res.status(200).json({
                status: "success",
                page: 1,
                pagesCount: 1,
                data: []
            });
            return;
        }

        res.status(200).json({
            status: "success",
            page: page,
            pagesCount: pagesCount,
            data: reports
        });
    });

    getReport = catchAsync(async (req, res) => {
        const reportID = +req.params["reportID"];

        const report = await reportModel.getReport({
            reportID: reportID
        });

        res.status(200).json({
            status: "success",
            data: report
        });
    });

    getReportPDF = catchAsync(async (req, res) => {
        const reportID = +req.params["reportID"];

        const pdf = await reportService.getReportPDF({
            reportID: reportID
        });

        const chunks: Uint8Array[] = [];
        let result;

        pdf.on("data", function (chunk) {
            chunks.push(chunk);
        });

        pdf.on("end", function () {
            result = Buffer.concat(chunks);
            res.contentType("application/pdf");
            res.send(result);
        });

        pdf.end();
    });

    updateReport = catchAsync(async (req, res) => {
        const reportID = +req.params["reportID"];

        const reportData = ReportUpdateSchema.parse(req.body);

        const report = await reportModel.updateReport({
            reportID: reportID,
            reportData: reportData
        });

        res.status(200).json({
            status: "success",
            data: report
        });
    });

    deleteReport = catchAsync(async (req, res) => {
        const reportID = +req.params["reportID"];
        const loggedInUserID = +res.locals.user.id;

        await reportModel.deleteReport({
            reportID: reportID,
            deletedByID: loggedInUserID
        });

        res.status(200).json({
            status: "success"
        });
    });
}
