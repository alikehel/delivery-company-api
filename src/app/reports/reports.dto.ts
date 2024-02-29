// // import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { Governorate, ReportStatus, ReportType } from "@prisma/client";
import { z } from "zod";

export const ReportCreateBaseSchema = z.object({
    ordersIDs: z.array(z.coerce.number()).min(1)
});

export const ReportCreateSchema = z
    .discriminatedUnion("type", [
        z.object({
            type: z.literal(ReportType.COMPANY),
            companyID: z.coerce.number()
        }),
        z.object({
            type: z.literal(ReportType.DELIVERY_AGENT),
            deliveryAgentID: z.coerce.number()
        }),
        z.object({
            type: z.literal(ReportType.GOVERNORATE),
            governorate: z.nativeEnum(Governorate)
        }),
        z.object({
            type: z.literal(ReportType.BRANCH),
            branchID: z.coerce.number()
        }),
        z.object({
            type: z.literal(ReportType.CLIENT),
            clientID: z.coerce.number(),
            storeID: z.coerce.number()
        }),
        z.object({
            type: z.literal(ReportType.REPOSITORY),
            repositoryID: z.coerce.number()
        })
    ])
    .and(ReportCreateBaseSchema);

export type ReportCreateType = z.infer<typeof ReportCreateSchema>;

export const ReportCreateOpenAPISchema = generateSchema(ReportCreateSchema);

// export const ReportCreateMock = generateMock(ReportCreateSchema);

/* --------------------------------------------------------------- */

export const ReportUpdateSchema = z.object({
    status: z.nativeEnum(ReportStatus),
    confirmed: z.boolean().optional()
});

export type ReportUpdateType = z.infer<typeof ReportUpdateSchema>;

export const ReportUpdateOpenAPISchema = generateSchema(ReportUpdateSchema);

// export const ReportUpdateMock = generateMock(ReportUpdateSchema);

/* --------------------------------------------------------------- */

export const ReportsFiltersSchema = z.object({
    page: z.coerce.number().optional().default(1),
    size: z.coerce.number().optional().default(10),
    company: z.coerce.number().optional(),
    branch: z.coerce.number().optional(),
    // TODO: Maybe change default sort
    sort: z.string().optional().default("id:desc"),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    governorate: z.nativeEnum(Governorate).optional(),
    status: z.nativeEnum(ReportStatus).optional(),
    type: z.nativeEnum(ReportType).optional(),
    storeID: z.coerce.number().optional(),
    repositoryID: z.coerce.number().optional(),
    branchID: z.coerce.number().optional(),
    deliveryAgentID: z.coerce.number().optional(),
    companyID: z.coerce.number().optional(),
    clientID: z.coerce.number().optional(),
    createdByID: z.coerce.number().optional(),
    deleted: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().default(false).optional()),
    minified: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional())
});

export type ReportsFiltersType = z.infer<typeof ReportsFiltersSchema>;

export const ReportsFiltersOpenAPISchema = generateSchema(ReportsFiltersSchema);

// export const ReportsFiltersMock = generateMock(ReportsFiltersSchema);

/* --------------------------------------------------------------- */
