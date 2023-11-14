import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { Governorate, ReportStatus, ReportType } from "@prisma/client";
import { z } from "zod";

export const ReportCreateBaseSchema = z.object({
    ordersIDs: z.array(z.string().uuid()).min(1)
});

export const ReportCreateSchema = z
    .discriminatedUnion("type", [
        z.object({
            type: z.literal(ReportType.COMPANY),
            companyID: z.string().uuid()
        }),
        z.object({
            type: z.literal(ReportType.DELIVERY_AGENT),
            deliveryAgentID: z.string().uuid()
        }),
        z.object({
            type: z.literal(ReportType.GOVERNORATE),
            governorate: z.nativeEnum(Governorate)
        }),
        z.object({
            type: z.literal(ReportType.BRANCH),
            branchID: z.string().uuid()
        }),
        z.object({
            type: z.literal(ReportType.CLIENT),
            clientID: z.string().uuid(),
            storeID: z.string().uuid()
        }),
        z.object({
            type: z.literal(ReportType.REPOSITORY),
            repositoryID: z.string().uuid()
        })
    ])
    .and(ReportCreateBaseSchema);

export type ReportCreateType = z.infer<typeof ReportCreateSchema>;

export const ReportCreateOpenAPISchema = generateSchema(ReportCreateSchema);

export const ReportCreateMock = generateMock(ReportCreateSchema);

/* --------------------------------------------------------------- */

export const ReportUpdateSchema = z.object({
    status: z.nativeEnum(ReportStatus)
});

export type ReportUpdateType = z.infer<typeof ReportUpdateSchema>;

export const ReportUpdateOpenAPISchema = generateSchema(ReportUpdateSchema);

export const ReportUpdateMock = generateMock(ReportUpdateSchema);

/* --------------------------------------------------------------- */
