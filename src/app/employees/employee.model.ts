import { EmployeeRole, Prisma, PrismaClient } from "@prisma/client";
import { EmployeeCreateType, EmployeeUpdateType } from "./employees.zod";

const prisma = new PrismaClient();

const employeeSelect = {
    salary: true,
    role: true,
    permissions: true,
    branch: true,
    repository: true,
    deliveryCost: true,
    user: {
        select: {
            id: true,
            name: true,
            username: true,
            phone: true,
            avatar: true,
            createdAt: true,
            updatedAt: true
        }
    },
    company: {
        select: {
            id: true,
            name: true,
            logo: true,
            color: true
        }
    },
    deleted: true,
    deletedAt: true,
    deletedBy: {
        select: {
            id: true,
            name: true
        }
    },
    _count: {
        select: {
            orders: true
            // deliveryAgentsLocations: true
        }
    }
} satisfies Prisma.EmployeeSelect;

const employeeReform = (
    employee: Prisma.EmployeeGetPayload<{
        select: typeof employeeSelect;
    }> | null
) => {
    if (!employee) {
        return null;
    }
    return {
        // TODO
        id: employee.user.id,
        name: employee.user.name,
        username: employee.user.username,
        phone: employee.user.phone,
        avatar: employee.user.avatar,
        salary: employee.salary,
        role: employee.role,
        permissions: employee.permissions,
        deliveryCost: employee.deliveryCost,
        branch: employee.branch,
        repository: employee.repository,
        company: employee.company,
        deleted: employee.deleted,
        deletedBy: employee.deleted && employee.deletedBy,
        deletedAt: employee.deletedAt?.toISOString(),
        ordersCount: employee._count.orders,
        createdAt: employee.user.createdAt.toISOString(),
        updatedAt: employee.user.updatedAt.toISOString()
        // deliveryAgentsLocationsCount: employee._count.deliveryAgentsLocations
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

    async getEmployeesCount(filters: {
        roles?: EmployeeRole[];
        role?: EmployeeRole;
        branchID?: number;
        locationID?: number;
        deleted?: string;
        ordersStartDate?: Date;
        ordersEndDate?: Date;
        companyID?: number;
    }) {
        const employeesCount = await prisma.employee.count({
            where: {
                AND: [
                    { role: { in: filters.roles } },
                    { role: filters.role },
                    {
                        branch: {
                            id: filters.branchID
                        }
                    },
                    {
                        deliveryAgentsLocations: filters.locationID
                            ? filters.roles?.find((role) => {
                                  return role === "DELIVERY_AGENT" || role === "RECEIVING_AGENT";
                              })
                                ? {
                                      some: {
                                          location: {
                                              id: filters.locationID
                                          }
                                      }
                                  }
                                : undefined
                            : undefined
                    },
                    { deleted: filters.deleted === "true" },
                    {
                        company: {
                            id: filters.companyID
                        }
                    }
                ]
            }
        });
        return employeesCount;
    }

    async getAllEmployees(
        skip: number,
        take: number,
        filters: {
            roles?: EmployeeRole[];
            role?: EmployeeRole;
            branchID?: number;
            locationID?: number;
            deleted?: string;
            ordersStartDate?: Date;
            ordersEndDate?: Date;
            companyID?: number;
            onlyTitleAndID?: boolean;
        }
    ) {
        const where = {
            AND: [
                { role: { in: filters.roles } },
                { role: filters.role },
                {
                    branch: {
                        id: filters.branchID
                    }
                },
                {
                    deliveryAgentsLocations: filters.locationID
                        ? filters.roles?.find((role) => {
                              return role === "DELIVERY_AGENT" || role === "RECEIVING_AGENT";
                          })
                            ? {
                                  some: {
                                      location: {
                                          id: filters.locationID
                                      }
                                  }
                              }
                            : undefined
                        : undefined
                },
                { deleted: filters.deleted === "true" },
                {
                    company: {
                        id: filters.companyID
                    }
                }
            ]
        };

        if (filters.onlyTitleAndID === true) {
            const employees = await prisma.employee.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            });
            return employees;
        }

        const employees = await prisma.employee.findMany({
            skip: skip,
            take: take,
            where: where,
            // orderBy: {
            //     name: "desc"
            // },
            select: {
                ...employeeSelect,
                _count: {
                    select: {
                        orders: {
                            where: {
                                createdAt: {
                                    gte: filters.ordersStartDate,
                                    lte: filters.ordersEndDate
                                }
                            }
                        }
                        // deliveryAgentsLocations: true
                    }
                }
            }
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

    async deactivateEmployee(data: {
        employeeID: number;
        deletedByID: number;
    }) {
        const deletedEmployee = await prisma.employee.update({
            where: {
                id: data.employeeID
            },
            data: {
                deleted: true,
                deletedAt: new Date(),
                deletedBy: {
                    connect: {
                        id: data.deletedByID
                    }
                }
            }
        });
        return deletedEmployee;
    }

    async reactivateEmployee(data: { employeeID: number }) {
        const deletedEmployee = await prisma.employee.update({
            where: {
                id: data.employeeID
            },
            data: {
                deleted: false
            }
        });
        return deletedEmployee;
    }
}
