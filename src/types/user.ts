import {
    AdminRole,
    ClientRole,
    EmployeeRole,
    Permission
} from "@prisma/client";

export type loggedInUserType = {
    id: number;
    name: string;
    username: string;
    role: AdminRole | EmployeeRole | ClientRole | null;
    permissions: Permission[] | null;
    companyID: number | null;
    companyName: string | null;
};
