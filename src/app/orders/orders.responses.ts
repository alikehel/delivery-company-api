import { Governorate, OrderStatus, Prisma } from "@prisma/client";

export const orderSelect = {
    id: true,
    totalCost: true,
    paidAmount: true,
    deliveryCost: true,
    clientNet: true,
    deliveryAgentNet: true,
    companyNet: true,
    discount: true,
    receiptNumber: true,
    quantity: true,
    weight: true,
    recipientName: true,
    recipientPhones: true,
    recipientAddress: true,
    notes: true,
    details: true,
    status: true,
    secondaryStatus: true,
    confirmed: true,
    deliveryType: true,
    deliveryDate: true,
    currentLocation: true,
    createdAt: true,
    updatedAt: true,
    timeline: true,
    forwarded: true,
    forwardedAt: true,
    forwardedBy: {
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    phone: true
                }
            }
        }
    },
    forwardedFrom: {
        select: {
            id: true,
            name: true,
            logo: true,
            registrationText: true
        }
    },
    client: {
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    phone: true
                }
            }
        }
    },
    deliveryAgent: {
        select: {
            deliveryCost: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    phone: true
                }
            }
        }
    },
    orderProducts: {
        select: {
            quantity: true,
            product: true,
            color: true,
            size: true
        }
    },
    ordersInquiryEmployees: {
        select: {
            inquiryEmployee: {
                select: {
                    role: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            avatar: true
                        }
                    }
                }
            }
        }
    },
    governorate: true,
    location: {
        select: {
            id: true,
            name: true
        }
    },
    store: {
        select: {
            id: true,
            name: true
        }
    },
    clientReport: {
        select: {
            id: true,
            clientId: true,
            storeId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    repositoryReport: {
        select: {
            id: true,
            repositoryId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    branchReport: {
        select: {
            id: true,
            branchId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    deliveryAgentReport: {
        select: {
            id: true,
            deliveryAgentId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    governorateReport: {
        select: {
            id: true,
            governorate: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    companyReport: {
        select: {
            id: true,
            companyId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    company: {
        select: {
            id: true,
            name: true,
            logo: true,
            registrationText: true
        }
    },
    branch: {
        select: {
            id: true,
            name: true
        }
    },
    repository: {
        select: {
            id: true,
            name: true
        }
    },
    deleted: true,
    deletedAt: true,
    deletedBy: {
        select: {
            id: true,
            name: true
        }
    }
} satisfies Prisma.OrderSelect;

export const orderReform = (
    order: Prisma.OrderGetPayload<{
        select: typeof orderSelect;
    }> | null
) => {
    if (!order) {
        return null;
    }
    const { ordersInquiryEmployees, ...orderReformed } = {
        ...order,
        // TODO
        client: {
            id: order.client.user.id,
            name: order.client.user.name,
            phone: order.client.user.phone
        },
        deliveryAgent: order.deliveryAgent && {
            id: order.deliveryAgent.user.id,
            name: order.deliveryAgent.user.name,
            phone: order.deliveryAgent.user.phone,
            deliveryCost: order.deliveryAgent.deliveryCost
        },
        forwardedBy: order.forwardedBy?.user,
        deleted: order.deleted,
        deletedBy: order.deleted && order.deletedBy,
        deletedAt: order.deletedAt?.toISOString(),
        clientReport: order.clientReport && {
            id: order.clientReport?.id,
            clientId: order.clientReport?.clientId,
            storeId: order.clientReport?.storeId,
            deleted: order.clientReport?.report.deleted
        },
        repositoryReport: order.repositoryReport && {
            id: order.repositoryReport?.id,
            repositoryId: order.repositoryReport?.repositoryId,
            deleted: order.repositoryReport?.report.deleted
        },
        branchReport: order.branchReport && {
            id: order.branchReport?.id,
            branchId: order.branchReport?.branchId,
            deleted: order.branchReport?.report.deleted
        },
        deliveryAgentReport: order.deliveryAgentReport && {
            id: order.deliveryAgentReport?.id,
            deliveryAgentId: order.deliveryAgentReport?.deliveryAgentId,
            deleted: order.deliveryAgentReport?.report.deleted
        },
        governorateReport: order.governorateReport && {
            id: order.governorateReport?.id,
            governorate: order.governorateReport?.governorate,
            deleted: order.governorateReport?.report.deleted
        },
        companyReport: order.companyReport && {
            id: order.companyReport?.id,
            companyId: order.companyReport?.companyId,
            deleted: order.companyReport?.report.deleted
        },
        inquiryEmployees: order.ordersInquiryEmployees.map((orderInquiryEmployee) => {
            return {
                id: orderInquiryEmployee.inquiryEmployee.user.id,
                name: orderInquiryEmployee.inquiryEmployee.user.name,
                phone: orderInquiryEmployee.inquiryEmployee.user.phone,
                avatar: orderInquiryEmployee.inquiryEmployee.user.avatar,
                role: orderInquiryEmployee.inquiryEmployee.role
            };
        })
    };
    return orderReformed;
};

/* --------------------------------------------------------------- */

export const statisticsReformed = (statistics: {
    ordersStatisticsByStatus: (Prisma.PickEnumerable<Prisma.OrderGroupByOutputType, "status"[]> & {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    })[];

    ordersStatisticsByGovernorate: (Prisma.PickEnumerable<Prisma.OrderGroupByOutputType, "governorate"[]> & {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    })[];

    allOrdersStatistics: {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    };

    allOrdersStatisticsWithoutClientReport: {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    };

    todayOrdersStatistics: {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    };
}) => {
    const sortingOrder = [
        "WITH_DELIVERY_AGENT",
        "POSTPONED",
        "RESEND",
        "PROCESSING",
        "DELIVERED",
        "PARTIALLY_RETURNED",
        "REPLACED",
        "CHANGE_ADDRESS",
        "RETURNED",
        "REGISTERED",
        "WITH_RECEIVING_AGENT",
        "READY_TO_SEND"
    ];

    const statisticsReformed = {
        ordersStatisticsByStatus: (Object.keys(OrderStatus) as Array<keyof typeof OrderStatus>)
            .map((status) => {
                const statusCount = statistics.ordersStatisticsByStatus.find(
                    (orderStatus: { status: string }) => {
                        return orderStatus.status === status;
                    }
                );
                return {
                    status: status,
                    totalCost: statusCount?._sum.totalCost || 0,
                    count: statusCount?._count.id || 0
                };
            })
            .sort((a, b) => {
                return sortingOrder.indexOf(a.status) - sortingOrder.indexOf(b.status);
            }),

        ordersStatisticsByGovernorate: (Object.keys(Governorate) as Array<keyof typeof Governorate>).map(
            (governorate) => {
                const governorateCount = statistics.ordersStatisticsByGovernorate.find(
                    (orderStatus: { governorate: string }) => {
                        return orderStatus.governorate === governorate;
                    }
                );
                return {
                    governorate: governorate,
                    totalCost: governorateCount?._sum.totalCost || 0,
                    count: governorateCount?._count.id || 0
                };
            }
        ),

        allOrdersStatistics: {
            totalCost: statistics.allOrdersStatistics._sum.totalCost || 0,
            count: statistics.allOrdersStatistics._count.id
        },

        allOrdersStatisticsWithoutClientReport: {
            totalCost: statistics.allOrdersStatisticsWithoutClientReport._sum.totalCost || 0,
            count: statistics.allOrdersStatisticsWithoutClientReport._count.id
        },

        todayOrdersStatistics: {
            totalCost: statistics.todayOrdersStatistics._sum.totalCost || 0,
            count: statistics.todayOrdersStatistics._count.id
        }
    };

    return statisticsReformed;
};
