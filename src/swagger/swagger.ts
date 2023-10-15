import swaggerAutogen from "swagger-autogen";

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
        examples: {},
        "@schemas": {
            UserSigninSchema: {
                type: "object",
                additionalProperties: false,
                properties: {
                    email: {
                        type: "string",
                        format: "username",
                        description: "Username",
                        example: "admin",
                        pattern: "",
                        maxLength: 32
                    },
                    password: {
                        type: "string",
                        description: "User password",
                        minLength: 6,
                        maxLength: 12,
                        example: "password",
                        pattern: "^[\\w\\W]+$"
                    }
                }
            }
            //     UserSignUpSchema: {
            //         type: "object",
            //         additionalProperties: false,
            //         properties: {
            //             email: {
            //                 type: "string",
            //                 format: "email",
            //                 description: "User email",
            //                 example: "studentusername@fci.bu.edu.eg",
            //                 pattern: "^\\w+[@]\\w+[.]\\w+$"
            //             },
            //             password: {
            //                 type: "string",
            //                 description: "User password",
            //                 minLength: 6,
            //                 maxLength: 12,
            //                 example: "password",
            //                 pattern: "^[\\w\\W]+$"
            //             },
            //             // passwordConfirm: {
            //             //     type: "string",
            //             //     description: "User password confirmation",
            //             //     minLength: 6,
            //             //     maxLength: 12,
            //             //     example: "password",
            //             //     pattern: "^[\\w\\W]+$"
            //             // },
            //             firstName: {
            //                 type: "string",
            //                 description: "User first name",
            //                 minLength: 2,
            //                 maxLength: 16,
            //                 example: "Ali",
            //                 pattern: "^[A-Za-z]+$"
            //             },
            //             lastName: {
            //                 type: "string",
            //                 description: "User last name",
            //                 minLength: 2,
            //                 maxLength: 16,
            //                 example: "Kehel",
            //                 pattern: "^[A-Za-z]+$"
            //             },
            //             phoneNumber: {
            //                 type: "string",
            //                 description: "User phone number with country code",
            //                 minLength: 2,
            //                 maxLength: 20,
            //                 pattern: "^\\+\\d+$",
            //                 example: "+201234567890"
            //             }
            //         }
            //     },
            //     OrganizationSignUpSchema: {
            //         type: "object",
            //         additionalProperties: false,
            //         properties: {
            //             name: {
            //                 type: "string",
            //                 description: "Organization name",
            //                 minLength: 2,
            //                 maxLength: 60,
            //                 example:
            //                     "Benha Faculty Of Computers & Artificial Intelligence",
            //                 pattern: "^[\\w\\W]+$"
            //             },
            //             type: {
            //                 type: "string",
            //                 description: "Organization type",
            //                 minLength: 2,
            //                 maxLength: 16,
            //                 example: "University",
            //                 pattern: "^[\\w]+$"
            //             },
            //             emailDomain: {
            //                 type: "string",
            //                 description: "Email domain for the organization",
            //                 minLength: 2,
            //                 maxLength: 16,
            //                 example: "fci.bu.edu.eg",
            //                 pattern: "^[\\w\\W]+$"
            //             },
            //             subdomain: {
            //                 type: "string",
            //                 description: "Subdomain for the organization",
            //                 minLength: 2,
            //                 maxLength: 16,
            //                 example: "bfcai",
            //                 pattern: "^[\\w]+$"
            //             },
            //             officialPhoneNumber: {
            //                 type: "string",
            //                 description:
            //                     "Official phone number for the organization with country code",
            //                 pattern: "^\\+20\\d{10}$",
            //                 example: "+201234567890"
            //             },
            //             country: {
            //                 type: "string",
            //                 description: "Country of the organization",
            //                 minLength: 2,
            //                 maxLength: 16,
            //                 example: "Egypt",
            //                 pattern: "^[\\w]+$"
            //             },
            //             address: {
            //                 type: "string",
            //                 description: "Address of the organization",
            //                 minLength: 2,
            //                 maxLength: 36,
            //                 example: "123 Main St, Cairo",
            //                 pattern: "^[\\w\\W]+$"
            //             }
            //         }
            //     }
        }
    }
};

const outputFile = "./src/swagger/swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
