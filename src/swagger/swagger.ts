import swaggerAutogen from "swagger-autogen";
import {
    EmployeeCreateMock,
    EmployeeCreateOpenAPISchema,
    EmployeeUpdateMock,
    EmployeeUpdateOpenAPISchema
} from "../app/employees/employees.zod";

import {
    UserSigninMock,
    UserSigninOpenAPISchema
} from "./../app/auth/auth.zod";

import {
    RepositoryCreateMock,
    RepositoryCreateOpenAPISchema,
    RepositoryUpdateMock,
    RepositoryUpdateOpenAPISchema
} from "./../app/repositories/repositories.zod";

import {
    LocationCreateMock,
    LocationCreateOpenAPISchema,
    LocationUpdateMock,
    LocationUpdateOpenAPISchema
} from "./../app/locations/locations.zod";

import {
    ClientCreateMock,
    ClientCreateOpenAPISchema,
    ClientUpdateMock,
    ClientUpdateOpenAPISchema
} from "./../app/clients/clients.zod";

import {
    BranchCreateMock,
    BranchCreateOpenAPISchema,
    BranchUpdateMock,
    BranchUpdateOpenAPISchema
} from "./../app/branches/branches.zod";

import {
    CompanyCreateMock,
    CompanyCreateOpenAPISchema,
    CompanyUpdateMock,
    CompanyUpdateOpenAPISchema
} from "../app/companies/companies.zod";

import {
    OrderCreateMock,
    OrderCreateOpenAPISchema,
    OrderUpdateMock,
    OrderUpdateOpenAPISchema,
    OrdersReceiptsCreateMock,
    OrdersReceiptsCreateOpenAPISchema
} from "./../app/orders/orders.zod";

import {
    ProductCreateMock,
    ProductCreateOpenAPISchema,
    ProductUpdateMock,
    ProductUpdateOpenAPISchema
} from "./../app/products/products.zod";

import {
    NotificationUpdateMock,
    NotificationUpdateOpenAPISchema
} from "./../app/notifications/notifications.zod";

import {
    CategoryCreateMock,
    CategoryCreateOpenAPISchema,
    CategoryUpdateMock,
    CategoryUpdateOpenAPISchema
} from "./../app/categories/categories.zod";

import {
    ColorCreateMock,
    ColorCreateOpenAPISchema,
    ColorUpdateMock,
    ColorUpdateOpenAPISchema
} from "./../app/colors/colors.zod";

import {
    SizeCreateMock,
    SizeCreateOpenAPISchema,
    SizeUpdateMock,
    SizeUpdateOpenAPISchema
} from "./../app/sizes/sizes.zod";

import {
    StoreCreateMock,
    StoreCreateOpenAPISchema,
    StoreUpdateMock,
    StoreUpdateOpenAPISchema
} from "./../app/stores/stores.zod";

import {
    BannerCreateMock,
    BannerCreateOpenAPISchema,
    BannerUpdateMock,
    BannerUpdateOpenAPISchema
} from "./../app/banners/banners.zod";

import {
    ReportCreateMock,
    ReportCreateOpenAPISchema,
    ReportUpdateMock,
    ReportUpdateOpenAPISchema
} from "./../app/reports/reports.zod";

import {
    AutomaticUpdateCreateMock,
    AutomaticUpdateCreateOpenAPISchema,
    AutomaticUpdateUpdateMock,
    AutomaticUpdateUpdateOpenAPISchema
} from "./../app/automaticUpdates/automaticUpdates.zod";

const doc = {
    info: {
        version: "1.0.0",
        title: "Al Barq API",
        description: ""
    },
    host: "localhost:3000",
    basePath: "/api/",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [],
    securityDefinitions: {
        // bearerAuth: {
        //     type: "http",
        //     scheme: "bearer",
        //     bearerFormat: "JWT"
        // }
    },
    components: {
        examples: {
            EmployeeCreateExample: { value: EmployeeCreateMock },
            UserSigninExample: { value: UserSigninMock },
            RepositoryCreateExample: { value: RepositoryCreateMock },
            EmployeeUpdateExample: { value: EmployeeUpdateMock },
            RepositoryUpdateExample: { value: RepositoryUpdateMock },
            LocationCreateExample: { value: LocationCreateMock },
            LocationUpdateExample: { value: LocationUpdateMock },
            ClientCreateExample: { value: ClientCreateMock },
            ClientUpdateExample: { value: ClientUpdateMock },
            BranchCreateExample: { value: BranchCreateMock },
            BranchUpdateExample: { value: BranchUpdateMock },
            CompanyCreateExample: { value: CompanyCreateMock },
            CompanyUpdateExample: { value: CompanyUpdateMock },
            OrderCreateExample: { value: OrderCreateMock },
            OrderUpdateExample: { value: OrderUpdateMock },
            ProductCreateExample: { value: ProductCreateMock },
            ProductUpdateExample: { value: ProductUpdateMock },
            NotificationUpdateExample: { value: NotificationUpdateMock },
            CategoryUpdateExample: { value: CategoryUpdateMock },
            CategoryCreateExample: { value: CategoryCreateMock },
            ColorCreateExample: { value: ColorCreateMock },
            ColorUpdateExample: { value: ColorUpdateMock },
            SizeCreateExample: { value: SizeCreateMock },
            SizeUpdateExample: { value: SizeUpdateMock },
            StoreCreateExample: { value: StoreCreateMock },
            StoreUpdateExample: { value: StoreUpdateMock },
            BannerCreateExample: { value: BannerCreateMock },
            BannerUpdateExample: { value: BannerUpdateMock },
            ReportCreateExample: { value: ReportCreateMock },
            ReportUpdateExample: { value: ReportUpdateMock },
            OrdersReceiptsCreateExample: { value: OrdersReceiptsCreateMock },
            AutomaticUpdateCreateExample: {
                value: AutomaticUpdateCreateMock
            },
            AutomaticUpdateUpdateExample: {
                value: AutomaticUpdateUpdateMock
            }
        },
        "@schemas": {
            SuccessResponseSchema: {
                type: "object",
                properties: {
                    status: {
                        type: "string",
                        enum: ["success"]
                    },
                    data: {
                        type: "object"
                    }
                }
            },
            // SigninSuccessResponseSchema: {
            //     type: "object",
            //     properties: {
            //         status: {
            //             type: "string",
            //             enum: ["success"]
            //         },
            //         data: {
            //             type: "object",
            //             properties: {
            //                 token: {
            //                     type: "string"
            //                 }
            //             }
            //         }
            //     }
            // },
            ErrorResponseSchema: {
                type: "object",
                properties: {
                    status: {
                        type: "string",
                        enum: ["error"]
                    },
                    message: {
                        type: "string"
                    }
                }
            },
            EmployeeCreateSchema: EmployeeCreateOpenAPISchema,
            UserSigninSchema: UserSigninOpenAPISchema,
            RepositoryCreateSchema: RepositoryCreateOpenAPISchema,
            EmployeeUpdateSchema: EmployeeUpdateOpenAPISchema,
            RepositoryUpdateSchema: RepositoryUpdateOpenAPISchema,
            LocationCreateSchema: LocationCreateOpenAPISchema,
            LocationUpdateSchema: LocationUpdateOpenAPISchema,
            ClientCreateSchema: ClientCreateOpenAPISchema,
            ClientUpdateSchema: ClientUpdateOpenAPISchema,
            BranchCreateSchema: BranchCreateOpenAPISchema,
            BranchUpdateSchema: BranchUpdateOpenAPISchema,
            CompanyCreateSchema: CompanyCreateOpenAPISchema,
            CompanyUpdateSchema: CompanyUpdateOpenAPISchema,
            OrderCreateSchema: OrderCreateOpenAPISchema,
            OrderUpdateSchema: OrderUpdateOpenAPISchema,
            ProductCreateSchema: ProductCreateOpenAPISchema,
            ProductUpdateSchema: ProductUpdateOpenAPISchema,
            NotificationUpdateSchema: NotificationUpdateOpenAPISchema,
            CategoryUpdateSchema: CategoryUpdateOpenAPISchema,
            CategoryCreateSchema: CategoryCreateOpenAPISchema,
            ColorCreateSchema: ColorCreateOpenAPISchema,
            ColorUpdateSchema: ColorUpdateOpenAPISchema,
            SizeCreateSchema: SizeCreateOpenAPISchema,
            SizeUpdateSchema: SizeUpdateOpenAPISchema,
            StoreCreateSchema: StoreCreateOpenAPISchema,
            StoreUpdateSchema: StoreUpdateOpenAPISchema,
            BannerCreateSchema: BannerCreateOpenAPISchema,
            BannerUpdateSchema: BannerUpdateOpenAPISchema,
            ReportCreateSchema: ReportCreateOpenAPISchema,
            ReportUpdateSchema: ReportUpdateOpenAPISchema,
            OrdersReceiptsCreateSchema: OrdersReceiptsCreateOpenAPISchema,
            AutomaticUpdateCreateSchema: AutomaticUpdateCreateOpenAPISchema,
            AutomaticUpdateUpdateSchema: AutomaticUpdateUpdateOpenAPISchema
        }
    }
};

const outputFile = "./src/swagger/swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
