import swaggerAutogen from "swagger-autogen";
import {
    UserCreateMock,
    UserCreateOpenApiSchema,
    UserUpdateMock,
    UserUpdateOpenApiSchema
} from "./../app/users/users.zod";

import {
    UserSigninMock,
    UserSigninOpenApiSchema
} from "./../app/auth/auth.zod";

import {
    RepositoryCreateMock,
    RepositoryCreateOpenApiSchema,
    RepositoryUpdateMock,
    RepositoryUpdateOpenApiSchema
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

const doc = {
    info: {
        version: "1.0.0",
        title: "Al Barq API",
        description: "" // by default: ''
    },
    host: "localhost:3000",
    basePath: "/api/",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "Auth Routes",
            description: "Signin & Signup Routes"
        }
    ],
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
            BranchUpdateExample: { value: BranchUpdateMock }
        },
        "@schemas": {
            UserCreateSchema: UserCreateOpenApiSchema,
            UserSigninSchema: UserSigninOpenApiSchema,
            RepositoryCreateSchema: RepositoryCreateOpenApiSchema,
            UserUpdateSchema: UserUpdateOpenApiSchema,
            RepositoryUpdateSchema: RepositoryUpdateOpenApiSchema,
            LocationCreateSchema: LocationCreateOpenAPISchema,
            LocationUpdateSchema: LocationUpdateOpenAPISchema,
            ClientCreateSchema: ClientCreateOpenAPISchema,
            ClientUpdateSchema: ClientUpdateOpenAPISchema,
            BranchCreateSchema: BranchCreateOpenAPISchema,
            BranchUpdateSchema: BranchUpdateOpenAPISchema
        }
    }
};

const outputFile = "./src/swagger/swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
