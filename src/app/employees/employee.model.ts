import { EmployeeRole, Permission, Prisma } from "@prisma/client";
import { prisma } from "../../database/db";
import { EmployeeCreateType, EmployeeUpdateType } from "./employees.zod";

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
    },
    managedStores: {
        select: {
            id: true,
            name: true
        }
    },
    inquiryBranches: {
        select: {
            branch: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    },
    inquiryLocations: {
        select: {
            location: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    },
    inquiryCompanies: {
        select: {
            company: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    },
    inquiryStores: {
        select: {
            store: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    },
    // inquiryDeliveryAgents: {
    //     select: {
    //         deliveryAgent: {
    //             select: {
    //                 user: {
    //                     select: {
    //                         id: true,
    //                         name: true
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // },
    // inquiryEmployees: {
    //     select: {
    //         inquiryEmployee: {
    //             select: {
    //                 user: {
    //                     select: {
    //                         id: true,
    //                         name: true
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // },
    inquiryGovernorates: true,
    inquiryStatuses: true
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
        updatedAt: employee.user.updatedAt.toISOString(),
        managedStores: employee.managedStores,
        inquiryBranches: employee.inquiryBranches.map((branch) => {
            return branch.branch;
        }),
        inquiryLocations: employee.inquiryLocations.map((location) => {
            return location.location;
        }),
        inquiryCompanies: employee.inquiryCompanies.map((company) => {
            return company.company;
        }),
        inquiryStores: employee.inquiryStores.map((store) => {
            return store.store;
        }),
        // inquiryDeliveryAgents: employee.inquiryDeliveryAgents.map((deliveryAgent) => {
        //     return deliveryAgent.deliveryAgent.user;
        // }),
        // inquiryEmployees: employee.inquiryEmployees.map((inquiryEmployee) => {
        //     return inquiryEmployee.inquiryEmployee.user;
        // }),
        inquiryGovernorates: employee.inquiryGovernorates,
        inquiryStatuses: employee.inquiryStatuses
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
                    : undefined,
                managedStores: data.storesIDs
                    ? {
                          connect: data.storesIDs.map((storeID) => {
                              return {
                                  id: storeID
                              };
                          })
                      }
                    : undefined,
                inquiryStores: data.inquiryStoresIDs
                    ? {
                          create: data.inquiryStoresIDs.map((storeID) => {
                              return {
                                  store: {
                                      connect: {
                                          id: storeID
                                      }
                                  }
                              };
                          })
                      }
                    : undefined,
                inquiryLocations: data.inquiryLocationsIDs
                    ? {
                          createMany: {
                              data: data.inquiryLocationsIDs.map((locationID) => {
                                  return {
                                      locationId: locationID
                                  };
                              })
                          }
                      }
                    : undefined,
                inquiryBranches: data.inquiryBranchesIDs
                    ? {
                          createMany: {
                              data: data.inquiryBranchesIDs.map((branchID) => {
                                  return {
                                      branchId: branchID
                                  };
                              })
                          }
                      }
                    : undefined,
                inquiryCompanies: data.inquiryCompaniesIDs
                    ? {
                          createMany: {
                              data: data.inquiryCompaniesIDs.map((companyID) => {
                                  return {
                                      companyId: companyID
                                  };
                              })
                          }
                      }
                    : undefined,
                // inquiryDeliveryAgents: data.inquiryDeliveryAgentsIDs
                //     ? {
                //           createMany: {
                //               data: data.inquiryDeliveryAgentsIDs.map((deliveryAgentID) => {
                //                   return {
                //                       deliveryAgentId: deliveryAgentID
                //                   };
                //               })
                //           }
                //       }
                //     : undefined,
                inquiryGovernorates: data.inquiryGovernorates
                    ? {
                          set: data.inquiryGovernorates
                      }
                    : undefined,
                inquiryStatuses: data.inquiryStatuses
                    ? {
                          set: data.inquiryStatuses
                      }
                    : undefined
            },
            select: employeeSelect
        });
        return employeeReform(createdEmployee);
    }

    async getAllEmployeesPaginated(filters: {
        page: number;
        size: number;
        roles?: EmployeeRole[];
        role?: EmployeeRole;
        branchID?: number;
        locationID?: number;
        deleted?: string;
        ordersStartDate?: Date;
        ordersEndDate?: Date;
        companyID?: number;
        minified?: boolean;
        permissions?: Permission[];
    }) {
        const where = {
            AND: [
                { permissions: filters.permissions ? { hasEvery: filters.permissions } : undefined },
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

        if (filters.minified === true) {
            const employees = await prisma.employee.findManyPaginated(
                {
                    where: where,
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                {
                    page: filters.page,
                    size: filters.size
                }
            );
            return {
                employees: employees.data.map((employee) => {
                    return {
                        id: employee.id,
                        name: employee.user.name
                    };
                }),
                pagesCount: employees.pagesCount
            };
        }

        const employees = await prisma.employee.findManyPaginated(
            {
                where: where,
                orderBy: {
                    id: "desc"
                },
                select: {
                    ...employeeSelect,
                    _count: {
                        select: {
                            orders: {
                                where: {
                                    createdAt: {
                                        gte: filters.ordersStartDate,
                                        lte: filters.ordersEndDate
                                    },
                                    confirmed: true,
                                    deleted: false
                                }
                            }
                            // deliveryAgentsLocations: true
                        }
                    }
                }
            },
            {
                page: filters.page,
                size: filters.size
            }
        );

        return {
            employees: employees.data.map(employeeReform),
            pagesCount: employees.pagesCount
        };
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
        // companyID: number;
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
                // company: data.employeeData.companyID
                //     ? {
                //           connect: {
                //               id: data.employeeData.companyID
                //           }
                //       }
                //     : undefined,
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
                    : undefined,
                managedStores: data.employeeData.storesIDs
                    ? {
                          set: data.employeeData.storesIDs.map((storeID) => {
                              return {
                                  id: storeID
                              };
                          })
                      }
                    : undefined,
                inquiryStores: data.employeeData.inquiryStoresIDs
                    ? {
                          deleteMany: {
                              inquiryEmployeeId: data.employeeID
                          },
                          create: data.employeeData.inquiryStoresIDs.map((storeID) => {
                              return {
                                  store: {
                                      connect: {
                                          id: storeID
                                      }
                                  }
                              };
                          })
                      }
                    : undefined,
                inquiryBranches: data.employeeData.inquiryBranchesIDs
                    ? {
                          deleteMany: {
                              inquiryEmployeeId: data.employeeID
                          },
                          createMany: {
                              data: data.employeeData.inquiryBranchesIDs.map((branchID) => {
                                  return {
                                      branchId: branchID
                                  };
                              })
                          }
                      }
                    : undefined,
                inquiryCompanies: data.employeeData.inquiryCompaniesIDs
                    ? {
                          deleteMany: {
                              inquiryEmployeeId: data.employeeID
                          },
                          createMany: {
                              data: data.employeeData.inquiryCompaniesIDs.map((companyID) => {
                                  return {
                                      companyId: companyID
                                  };
                              })
                          }
                      }
                    : undefined,
                // inquiryDeliveryAgents: data.employeeData.inquiryDeliveryAgentsIDs
                //     ? {
                //           deleteMany: {
                //               inquiryEmployeeId: data.employeeID
                //           },
                //           createMany: {
                //               data: data.employeeData.inquiryDeliveryAgentsIDs.map((deliveryAgentID) => {
                //                   return {
                //                       deliveryAgentId: deliveryAgentID
                //                   };
                //               })
                //           }
                //       }
                //     : undefined,
                inquiryGovernorates: data.employeeData.inquiryGovernorates
                    ? {
                          set: data.employeeData.inquiryGovernorates
                      }
                    : undefined,
                inquiryStatuses: data.employeeData.inquiryStatuses
                    ? {
                          set: data.employeeData.inquiryStatuses
                      }
                    : undefined,
                inquiryLocations: data.employeeData.inquiryLocationsIDs
                    ? {
                          deleteMany: {
                              inquiryEmployeeId: data.employeeID
                          },
                          createMany: {
                              data: data.employeeData.inquiryLocationsIDs.map((locationID) => {
                                  return {
                                      locationId: locationID
                                  };
                              })
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

    async getCompanyManager(data: { companyID: number }) {
        const companyManager = await prisma.employee.findFirst({
            where: {
                role: "COMPANY_MANAGER",
                company: {
                    id: data.companyID
                }
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return {
            id: companyManager?.user.id,
            name: companyManager?.user.name
        };
    }
}
