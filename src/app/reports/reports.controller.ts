// import AppError from "../../utils/AppError.util";
import { loggedInUserType } from "../../types/user";
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
        const loggedInUser = res.locals.user;

        const pdf = await reportService.createReport(companyID, {
            loggedInUser,
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
        const loggedInUser: loggedInUserType = res.locals.user;

        const { page, pagesCount, reports } = await reportService.getAllReports(
            {
                queryString: queryString,
                loggedInUser: loggedInUser
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
        const loggedInUser = res.locals.user;

        const reportData = ReportUpdateSchema.parse(req.body);

        const report = await reportService.updateReport({
            reportID: reportID,
            reportData: reportData,
            loggedInUser: loggedInUser
        });

        res.status(200).json({
            status: "success",
            data: report
        });
    });

    deleteReport = catchAsync(async (req, res) => {
        const reportID = +req.params["reportID"];

        await reportService.deleteReport(reportID);

        res.status(200).json({
            status: "success"
        });
    });

    deactivateReport = catchAsync(async (req, res) => {
        const reportID = +req.params["reportID"];
        const loggedInUserID = +res.locals.user.id;

        await reportService.deactivateReport(reportID, loggedInUserID);

        res.status(200).json({
            status: "success"
        });
    });

    reactivateReport = catchAsync(async (req, res) => {
        const reportID = +req.params["reportID"];

        await reportService.reactivateReport(reportID);

        res.status(200).json({
            status: "success"
        });
    });
}
