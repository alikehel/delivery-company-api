import { AdminRole, ClientRole, EmployeeRole, Permission } from "@prisma/client";

// export type loggedInUserType = {
//     id: number;
//     name: string;
//     username: string;
//     role: AdminRole | EmployeeRole | ClientRole;
//     permissions: Permission[] | null;
//     companyID: AdminRole extends typeof role ? null : number;
//     companyName: AdminRole extends typeof role ? null : string;
// };

export type AdminUserType = {
    role: AdminRole;
    companyID: null;
    companyName: null;
};

export type NonAdminUserType = {
    role: EmployeeRole | ClientRole;
    companyID: number;
    companyName: string;
};

export type loggedInUserType = {
    id: number;
    name: string;
    username: string;
    permissions: Permission[] | null;
} & (AdminUserType | NonAdminUserType);
