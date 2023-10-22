import swaggerAutogen from "swagger-autogen";
import {
    UserCreateMock,
    UserCreateOpenAPISchema,
    UserUpdateMock,
    UserUpdateOpenAPISchema
} from "./../app/users/users.zod";

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
    TenantCreateMock,
    TenantCreateOpenAPISchema,
    TenantUpdateMock,
    TenantUpdateOpenAPISchema
} from "./../app/tenants/tenants.zod";

import {
    OrderCreateMock,
    OrderCreateOpenAPISchema,
    OrderUpdateMock,
    OrderUpdateOpenAPISchema
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
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
        }
    },
    components: {
        examples: {
            UserCreateExample: { value: UserCreateMock },
            UserSigninExample: { value: UserSigninMock },
            RepositoryCreateExample: { value: RepositoryCreateMock },
            UserUpdateExample: { value: UserUpdateMock },
            RepositoryUpdateExample: { value: RepositoryUpdateMock },
            LocationCreateExample: { value: LocationCreateMock },
            LocationUpdateExample: { value: LocationUpdateMock },
            ClientCreateExample: { value: ClientCreateMock },
            ClientUpdateExample: { value: ClientUpdateMock },
            BranchCreateExample: { value: BranchCreateMock },
            BranchUpdateExample: { value: BranchUpdateMock },
            TenantCreateExample: { value: TenantCreateMock },
            TenantUpdateExample: { value: TenantUpdateMock },
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
            SizeUpdateExample: { value: SizeUpdateMock }
        },
        "@schemas": {
            UserCreateSchema: UserCreateOpenAPISchema,
            UserSigninSchema: UserSigninOpenAPISchema,
            RepositoryCreateSchema: RepositoryCreateOpenAPISchema,
            UserUpdateSchema: UserUpdateOpenAPISchema,
            RepositoryUpdateSchema: RepositoryUpdateOpenAPISchema,
            LocationCreateSchema: LocationCreateOpenAPISchema,
            LocationUpdateSchema: LocationUpdateOpenAPISchema,
            ClientCreateSchema: ClientCreateOpenAPISchema,
            ClientUpdateSchema: ClientUpdateOpenAPISchema,
            BranchCreateSchema: BranchCreateOpenAPISchema,
            BranchUpdateSchema: BranchUpdateOpenAPISchema,
            TenantCreateSchema: TenantCreateOpenAPISchema,
            TenantUpdateSchema: TenantUpdateOpenAPISchema,
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
            SizeUpdateSchema: SizeUpdateOpenAPISchema
        }
    }
};

const outputFile = "./src/swagger/swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
