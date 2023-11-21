import { EmployeeRole, Prisma, PrismaClient } from "@prisma/client";
import { EmployeeCreateType, EmployeeUpdateType } from "./employees.zod";

const prisma = new PrismaClient();

const employeeSelect: Prisma.EmployeeSelect = {
    id: true,
    salary: true,
    role: true,
    permissions: true,
    branch: true,
    repository: true,
    user: {
        select: {
            id: true,
            name: true,
            username: true,
            phone: true,
            avatar: true
        }
    }
};

const employeeReform = (employee: any) => {
    return {
        // TODO
        id: employee.id,
        name: employee.user.name,
        username: employee.user.username,
        phone: employee.user.phone,
        avatar: employee.user.avatar,
        salary: employee.salary,
        role: employee.role,
        permissions: employee.permissions,
        branch: employee.branch,
        repository: employee.repository
    };
};

export class EmployeeModel {
    async createEmployee(companyID: number, data: EmployeeCreateType) {
        const createdEmployee = await prisma.employee.create({
            data: {
                user: {
                    create: {
                        name: data.name,
                        username: data.username,
                        password: data.password,
                        phone: data.phone,
                        fcm: data.fcm,
                        avatar: data.avatar
                    }
                },
                salary: data.salary,
                role: data.role,
                company: {
                    connect: {
                        id: companyID
                    }
                },
                permissions: data.permissions
                    ? {
                          set: data.permissions
                      }
                    : undefined,
                branch: data.branchID
                    ? {
                          connect: {
                              id: data.branchID
                          }
                      }
                    : undefined,
                repository: data.repositoryID
                    ? {
                          connect: {
                              id: data.repositoryID
                          }
                      }
                    : undefined
            },
            select: employeeSelect
        });
        return employeeReform(createdEmployee);
    }

    async getEmployeesCount() {
        const employeesCount = await prisma.employee.count();
        return employeesCount;
    }

    async getAllEmployees(
        skip: number,
        take: number,
        filters: { roles?: EmployeeRole[] }
    ) {
        const employees = await prisma.employee.findMany({
            skip: skip,
            take: take,
            where: {
                AND: [{ role: { in: filters.roles } }]
            },
            // orderBy: {
            //     name: "desc"
            // },
            select: employeeSelect
        });
        return employees.map(employeeReform);
    }

    async getEmployee(data: { employeeID: number }) {
        const employee = await prisma.employee.findUnique({
            where: {
                id: data.employeeID
            },
            select: employeeSelect
        });
        return employeeReform(employee);
    }

    async updateEmployee(data: {
        employeeID: number;
        companyID: number;
        employeeData: EmployeeUpdateType;
    }) {
        const employee = await prisma.employee.update({
            where: {
                id: data.employeeID
            },
            data: {
                user: {
                    update: {
                        name: data.employeeData.name,
                        username: data.employeeData.username,
                        password: data.employeeData.password,
                        phone: data.employeeData.phone,
                        fcm: data.employeeData.fcm,
                        avatar: data.employeeData.avatar
                    }
                },
                salary: data.employeeData.salary,
                role: data.employeeData.role,
                company: {
                    connect: {
                        id: data.companyID
                    }
                },
                permissions: data.employeeData.permissions,
                branch: data.employeeData.branchID
                    ? {
                          connect: {
                              id: data.employeeData.branchID
                          }
                      }
                    : undefined,
                repository: data.employeeData.repositoryID
                    ? {
                          connect: {
                              id: data.employeeData.repositoryID
                          }
                      }
                    : undefined
            },
            select: employeeSelect
        });
        return employeeReform(employee);
    }

    async deleteEmployee(data: { employeeID: number }) {
        const deletedEmployee = await prisma.employee.delete({
            where: {
                id: data.employeeID
            }
        });
        return deletedEmployee;
    }
}
