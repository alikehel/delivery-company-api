import {
    DeliveryType,
    Governorate,
    OrderStatus,
    Prisma,
    PrismaClient
} from "@prisma/client";
import AppError from "../../utils/AppError.util";
import {
    OrderCreateType,
    OrderTimelineType,
    OrderUpdateType
} from "./orders.zod";

const prisma = new PrismaClient();

export const orderSelect = {
    id: true,
    totalCost: true,
    paidAmount: true,
    deliveryCost: true,
    clientNet: true,
    // deliveryAgentNet: true,
    companyNet: true,
    discount: true,
    receiptNumber: true,
    quantity: true,
    weight: true,
    recipientName: true,
    recipientPhone: true,
    recipientAddress: true,
    notes: true,
    details: true,
    status: true,
    deliveryType: true,
    deliveryDate: true,
    currentLocation: true,
    createdAt: true,
    updatedAt: true,
    timeline: true,
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
    clientReport: true,
    repositoryReport: true,
    branchReport: true,
    deliveryAgentReport: true,
    governorateReport: true,
    companyReport: true,
    company: {
        select: {
            id: true,
            name: true
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
    return {
        ...order,
        // TODO
        client: {
            id: order.client?.user.id,
            name: order.client?.user.name,
            phone: order.client?.user.phone
        },
        deliveryAgent: order.deliveryAgent
            ? {
                  id: order.deliveryAgent.user.id,
                  name: order.deliveryAgent.user.name,
                  phone: order.deliveryAgent.user.phone,
                  deliveryCost: order.deliveryAgent.deliveryCost
              }
            : undefined,
        deleted: order.deleted,
        deletedBy: order.deleted && order.deletedBy,
        deletedAt: order.deletedAt && order.deletedAt.toISOString()
    };
};

const ordersStatusesReformed = (
    ordersStatuses: (Prisma.PickEnumerable<
        Prisma.OrderGroupByOutputType,
        "status"[]
    > & {
        _count: {
            status: number;
        };
    })[]
) => {
    const ordersStatusesReformed = (
        Object.keys(OrderStatus) as Array<keyof typeof OrderStatus>
    ).map((status) => {
        const statusCount = ordersStatuses.find(
            (orderStatus: { status: string }) => {
                return orderStatus.status === status;
            }
        );

        return {
            status: status,
            count: statusCount?._count?.status || 0
        };
    });

    return ordersStatusesReformed;
};

const statisticsReformed = (statistics: {
    ordersStatisticsByStatus: (Prisma.PickEnumerable<
        Prisma.OrderGroupByOutputType,
        "status"[]
    > & {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: Prisma.Decimal | null;
        };
    })[];

    ordersStatisticsByGovernorate: (Prisma.PickEnumerable<
        Prisma.OrderGroupByOutputType,
        "governorate"[]
    > & {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: Prisma.Decimal | null;
        };
    })[];

    allOrdersStatistics: {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: Prisma.Decimal | null;
        };
    };
}) => {
    const statisticsReformed = {
        ordersStatisticsByStatus: (
            Object.keys(OrderStatus) as Array<keyof typeof OrderStatus>
        ).map((status) => {
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
        }),
        ordersStatisticsByGovernorate: (
            Object.keys(Governorate) as Array<keyof typeof Governorate>
        ).map((governorate) => {
            const governorateCount =
                statistics.ordersStatisticsByGovernorate.find(
                    (orderStatus: { governorate: string }) => {
                        return orderStatus.governorate === governorate;
                    }
                );
            return {
                governorate: governorate,
                totalCost: governorateCount?._sum.totalCost || 0,
                count: governorateCount?._count.id || 0
            };
        }),
        allOrdersStatistics: {
            totalCost: statistics.allOrdersStatistics._sum.totalCost || 0,
            count: statistics.allOrdersStatistics._count.id
        }
    };

    return statisticsReformed;
};

const todayOrdersCountAndEarningsReformed = (
    todayOrdersCountAndEarnings: Prisma.GetOrderAggregateType<{
        _sum: {
            totalCost: true;
            paidAmount: true;
        };
        _count: {
            id: true;
        };
        where: {
            createdAt: {
                gte: Date;
            };
        };
    }>
) => {
    const todayOrdersCountAndEarningsReformed = {
        count: todayOrdersCountAndEarnings._count.id,
        totalCost: todayOrdersCountAndEarnings._sum.totalCost || 0
    };

    return todayOrdersCountAndEarningsReformed;
};

const chatMembersReformed = (
    chatMembers: Prisma.OrderGetPayload<{
        select: {
            client: {
                select: {
                    user: {
                        select: {
                            id: true;
                            name: true;
                            phone: true;
                            avatar: true;
                        };
                    };
                };
            };
            deliveryAgent: {
                select: {
                    user: {
                        select: {
                            id: true;
                            name: true;
                            phone: true;
                            avatar: true;
                        };
                    };
                };
            };
        };
    }> | null
) => {
    if (!chatMembers) {
        return null;
    }
    return [
        {
            ...chatMembers.client?.user,
            role: "client"
        },
        {
            ...chatMembers.deliveryAgent?.user,
            role: "deliveryAgent"
        }
    ];
};

export class OrderModel {
    async createOrder(
        companyID: number,
        clientID: number,
        data: OrderCreateType
    ) {
        let totalCost = 0;
        let quantity = 0;
        let weight = 0;

        if (data.withProducts == true) {
            for (const product of data.products) {
                const productData = await prisma.product.findUnique({
                    where: {
                        id: product.productID
                    },
                    select: {
                        price: true,
                        weight: true
                    }
                });
                if (!productData) {
                    throw new Error("منتج غير موجود");
                }
                totalCost += +productData.price * product.quantity;
                quantity += product.quantity;
                weight += productData.weight * product.quantity;
            }
        }

        // Check if products are available for the specific color and size
        if (data.withProducts == true) {
            for (const product of data.products) {
                const productData = await prisma.product.findUnique({
                    where: {
                        id: product.productID
                    },
                    select: {
                        title: true
                    }
                });

                if (!productData) {
                    throw new AppError("منتج غير موجود", 400);
                }

                const productTitle = productData?.title;

                if (product.colorID) {
                    const productColor = await prisma.productColors.findUnique({
                        where: {
                            productId_colorId: {
                                productId: product.productID,
                                colorId: product.colorID
                            }
                        },
                        select: {
                            quantity: true,
                            color: {
                                select: {
                                    title: true
                                }
                            }
                        }
                    });

                    if (!productColor) {
                        throw new AppError(
                            `المنتج (${productTitle}) غير متوفر بهذا اللون`,
                            400
                        );
                    }

                    if (productColor.quantity < product.quantity) {
                        throw new AppError(
                            `الكمية المتاحة من المنتج (${productTitle}) باللون (${productColor.color.title}) هي (${productColor.quantity})`,
                            400
                        );
                    }
                }

                if (product.sizeID) {
                    const productSize = await prisma.productSizes.findUnique({
                        where: {
                            productId_sizeId: {
                                productId: product.productID,
                                sizeId: product.sizeID
                            }
                        },
                        select: {
                            quantity: true,
                            size: {
                                select: {
                                    title: true
                                }
                            }
                        }
                    });

                    if (!productSize) {
                        throw new AppError(
                            `المنتج (${productTitle}) غير متوفر بهذا المقاس`,
                            400
                        );
                    }

                    if (productSize.quantity < product.quantity) {
                        throw new AppError(
                            `الكمية المتاحة من المنتج (${productTitle}) بالمقاس (${productSize.size.title}) هي (${productSize.quantity})`,
                            400
                        );
                    }
                }

                if (product.quantity) {
                    const productQuantity = await prisma.product.findUnique({
                        where: {
                            id: product.productID
                        },
                        select: {
                            stock: true
                        }
                    });

                    if (!productQuantity) {
                        throw new AppError(
                            `المنتج (${productTitle}) غير متوفر`,
                            400
                        );
                    }

                    if (productQuantity.stock < product.quantity) {
                        throw new AppError(
                            `الكمية المتاحة من المنتج (${productTitle}) هي (${productQuantity.stock})`,
                            400
                        );
                    }
                }
            }
        }

        // Calculate delivery cost

        let deliveryCost = 0;

        const client = await prisma.client.findUnique({
            where: {
                id: clientID
            },
            select: {
                governoratesDeliveryCosts: true
            }
        });

        if (!client) {
            throw new AppError("العميل غير موجود", 400);
        }

        const governoratesDeliveryCosts = client.governoratesDeliveryCosts as {
            governorate: Governorate;
            cost: number;
        }[];

        if (governoratesDeliveryCosts) {
            deliveryCost =
                governoratesDeliveryCosts.find(
                    (governorateDeliveryCost: {
                        governorate: Governorate;
                        cost: number;
                    }) => {
                        return (
                            governorateDeliveryCost.governorate ===
                            data.governorate
                        );
                    }
                )?.cost || 0;
        }

        const createdOrder = await prisma.order.create({
            data: {
                totalCost:
                    data.withProducts === false ? data.totalCost : totalCost,
                deliveryCost: deliveryCost,
                quantity:
                    data.withProducts === false ? data.quantity : quantity,
                weight: data.withProducts === false ? data.weight : weight,
                recipientName: data.recipientName,
                recipientPhone: data.recipientPhone,
                receiptNumber: data.receiptNumber,
                recipientAddress: data.recipientAddress,
                notes: data.notes,
                details: data.details,
                deliveryType: data.deliveryType,
                governorate: data.governorate,
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
                location: data.locationID
                    ? {
                          connect: {
                              id: data.locationID
                          }
                      }
                    : undefined,
                store: {
                    connect: {
                        id: data.storeID
                    }
                },
                company: {
                    connect: {
                        id: companyID
                    }
                },
                client: {
                    connect: {
                        id: clientID
                    }
                },
                orderProducts:
                    data.withProducts === false
                        ? undefined
                        : {
                              create: data.products.map((product) => {
                                  return {
                                      quantity: product.quantity,
                                      size: product.sizeID
                                          ? {
                                                connect: {
                                                    id: product.sizeID
                                                }
                                            }
                                          : undefined,
                                      color: product.colorID
                                          ? {
                                                connect: {
                                                    id: product.colorID
                                                }
                                            }
                                          : undefined,
                                      product: {
                                          connect: {
                                              id: product.productID
                                          }
                                      }
                                  };
                              })
                          }
            },
            select: orderSelect
        });

        // TODO: Reduce products quantity and color and size quantity
        if (data.withProducts == true) {
            for (const product of data.products) {
                if (product.colorID) {
                    await prisma.productColors.update({
                        where: {
                            productId_colorId: {
                                productId: product.productID,
                                colorId: product.colorID
                            }
                        },
                        data: {
                            quantity: {
                                decrement: product.quantity
                            }
                        }
                    });
                }

                if (product.sizeID) {
                    await prisma.productSizes.update({
                        where: {
                            productId_sizeId: {
                                productId: product.productID,
                                sizeId: product.sizeID
                            }
                        },
                        data: {
                            quantity: {
                                decrement: product.quantity
                            }
                        }
                    });
                }

                if (product.quantity) {
                    await prisma.product.update({
                        where: {
                            id: product.productID
                        },
                        data: {
                            stock: {
                                decrement: product.quantity
                            }
                        }
                    });
                }
            }
        }

        return orderReform(createdOrder);
    }

    async getOrdersCount() {
        const ordersCount = await prisma.order.count({
            where: {
                deleted: false
            }
        });
        return ordersCount;
    }

    // search: search,
    //     sort: sort,
    //     startDate: startDate,
    //     endDate: endDate,
    //     deliveryDate: deliveryDate,
    //     governorate: governorate,
    //     status: status,
    //     deliveryType: deliveryType,
    //     deliveryAgentID: deliveryAgentID,
    //     clientID: clientID,
    //     storeID: storeID,
    //     repositoryID: repositoryID,
    //     productID: productID,
    //     locationID: locationID,
    //     receiptNumber: receiptNumber,
    //     recipientName: recipientName,
    //     recipientPhone: recipientPhone,
    //     notes: notes

    async getAllOrders(
        skip: number,
        take: number,
        filters: {
            search?: string;
            sort: string;
            startDate?: Date;
            endDate?: Date;
            deliveryDate?: Date;
            governorate?: Governorate;
            statuses?: OrderStatus[];
            deliveryType?: DeliveryType;
            deliveryAgentID?: number;
            clientID?: number;
            storeID?: number;
            // repositoryID?: number;
            productID?: number;
            locationID?: number;
            receiptNumber?: number;
            recipientName?: string;
            recipientPhone?: string;
            recipientAddress?: string;
            notes?: string;
            deleted?: string;
            clientReport: string;
            repositoryReport: string;
            branchReport: string;
            deliveryAgentReport: string;
            governorateReport: string;
            companyReport: string;
        }
    ) {
        const orders = await prisma.order.findMany({
            skip: skip,
            take: take,
            where: {
                AND: [
                    // Search by receiptNumber, recipientName, recipientPhone, recipientAddress
                    {
                        OR: [
                            {
                                receiptNumber: filters.search
                                    ? Number.isNaN(+filters.search)
                                        ? undefined
                                        : filters.search.length > 9
                                          ? undefined
                                          : +filters.search
                                    : undefined
                            },
                            {
                                repositoryReportId: filters.search
                                    ? Number.isNaN(+filters.search)
                                        ? undefined
                                        : filters.search.length > 9
                                          ? undefined
                                          : +filters.search
                                    : undefined
                            },
                            {
                                branchReportId: filters.search
                                    ? Number.isNaN(+filters.search)
                                        ? undefined
                                        : filters.search.length > 9
                                          ? undefined
                                          : +filters.search
                                    : undefined
                            },
                            {
                                deliveryAgentReportId: filters.search
                                    ? Number.isNaN(+filters.search)
                                        ? undefined
                                        : filters.search.length > 9
                                          ? undefined
                                          : +filters.search
                                    : undefined
                            },
                            {
                                governorateReportId: filters.search
                                    ? Number.isNaN(+filters.search)
                                        ? undefined
                                        : filters.search.length > 9
                                          ? undefined
                                          : +filters.search
                                    : undefined
                            },
                            {
                                companyReportId: filters.search
                                    ? Number.isNaN(+filters.search)
                                        ? undefined
                                        : filters.search.length > 9
                                          ? undefined
                                          : +filters.search
                                    : undefined
                            },
                            {
                                clientReportId: filters.search
                                    ? Number.isNaN(+filters.search)
                                        ? undefined
                                        : filters.search.length > 9
                                          ? undefined
                                          : +filters.search
                                    : undefined
                            },
                            {
                                recipientName: {
                                    contains: filters.search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                recipientPhone: {
                                    contains: filters.search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                recipientAddress: {
                                    contains: filters.search,
                                    mode: "insensitive"
                                }
                            }
                        ]
                    },
                    // Filter by status
                    {
                        status: { in: filters.statuses }
                    },
                    // Filter by deliveryType
                    {
                        deliveryType: filters.deliveryType
                    },
                    // Filter by deliveryDate
                    {
                        // gte deliveryDate day start time (00:00:00) and lte deliveryDate day end time (23:59:59)
                        deliveryDate: filters.deliveryDate
                            ? {
                                  gte: new Date(
                                      new Date(filters.deliveryDate).setHours(
                                          0,
                                          0,
                                          0,
                                          0
                                      )
                                  ),
                                  lte: new Date(
                                      new Date(filters.deliveryDate).setHours(
                                          23,
                                          59,
                                          59,
                                          999
                                      )
                                  )
                              }
                            : undefined
                    },
                    // Filter by governorate
                    {
                        governorate: filters.governorate
                    },
                    // Filter by deliveryAgentID
                    {
                        deliveryAgent: {
                            id: filters.deliveryAgentID
                        }
                    },
                    // Filter by clientID
                    {
                        client: {
                            id: filters.clientID
                        }
                    },
                    // Filter by storeID
                    {
                        store: {
                            id: filters.storeID
                        }
                    },
                    // // Filter by repositoryID
                    // {
                    //     OrderProducts: {
                    //         some: {
                    //             product: {
                    //                 repository: {
                    //                     id: filters.repositoryID
                    //                 }
                    //             }
                    //         }
                    //     }
                    // },
                    // Filter by productID
                    {
                        orderProducts: filters.productID
                            ? {
                                  some: {
                                      product: {
                                          id: filters.productID
                                      }
                                  }
                              }
                            : undefined
                    },
                    // Filter by locationID
                    {
                        location: {
                            id: filters.locationID
                        }
                    },
                    // Filter by receiptNumber
                    {
                        receiptNumber: filters.receiptNumber
                    },
                    // Filter by recipientName
                    {
                        recipientName: filters.recipientName
                    },
                    // Filter by recipientPhone
                    {
                        recipientPhone: filters.recipientPhone
                    },
                    // Filter by recipientAddress
                    {
                        recipientAddress: filters.recipientAddress
                    },
                    // Filter by notes
                    {
                        notes: filters.notes
                    },
                    // Filter by startDate
                    {
                        createdAt: {
                            gte: filters.startDate
                        }
                    },
                    // Filter by endDate
                    {
                        createdAt: {
                            lte: filters.endDate
                        }
                    },
                    // Filter by deleted
                    {
                        deleted: filters.deleted === "true" ? true : false
                    },
                    // Filter by clientReport
                    {
                        clientReport:
                            filters.clientReport === "true"
                                ? { isNot: null }
                                : filters.clientReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by repositoryReport
                    {
                        repositoryReport:
                            filters.repositoryReport === "true"
                                ? { isNot: null }
                                : filters.repositoryReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by branchReport
                    {
                        branchReport:
                            filters.branchReport === "true"
                                ? { isNot: null }
                                : filters.branchReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by deliveryAgentReport
                    {
                        deliveryAgentReport:
                            filters.deliveryAgentReport === "true"
                                ? { isNot: null }
                                : filters.deliveryAgentReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by governorateReport
                    {
                        governorateReport:
                            filters.governorateReport === "true"
                                ? { isNot: null }
                                : filters.governorateReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by companyReport
                    {
                        companyReport:
                            filters.companyReport === "true"
                                ? { isNot: null }
                                : filters.companyReport === "false"
                                  ? { is: null }
                                  : undefined
                    }
                ]
            },
            orderBy: {
                [filters.sort.split(":")[0]]:
                    filters.sort.split(":")[1] === "desc" ? "desc" : "asc"
            },
            select: orderSelect
        });

        return orders.map(orderReform);
    }
    // eslint-disable-next-line no-unused-vars
    async getOrdersByIDs(data: { ordersIDs: number[] }) {
        const orders = await prisma.order.findMany({
            where: {
                id: {
                    in: data.ordersIDs
                }
            },
            select: orderSelect
        });
        return orders.map(orderReform);
    }

    async getOrder(data: { orderID: number }) {
        const order = await prisma.order.findUnique({
            where: {
                id: data.orderID
            },
            select: orderSelect
        });
        return orderReform(order);
    }

    async updateOrder(data: { orderID: number; orderData: OrderUpdateType }) {
        let deliveryAgentCost;
        let companyNet;
        let clientNet;
        if (data.orderData.paidAmount) {
            // calculate client net
            const orderData = await prisma.order.findUnique({
                where: {
                    id: data.orderID
                },
                select: {
                    deliveryCost: true,
                    deliveryAgent: {
                        select: {
                            deliveryCost: true
                        }
                    }
                }
            });
            const deliveryCost = (orderData?.deliveryCost || 0) as number;
            clientNet = data.orderData.paidAmount - deliveryCost;

            // calculate company net
            if (data.orderData.deliveryAgentID) {
                const orderDeliveryAgent = await prisma.employee.findUnique({
                    where: {
                        id: data.orderData.deliveryAgentID
                    },
                    select: {
                        deliveryCost: true
                    }
                });
                deliveryAgentCost = (orderDeliveryAgent?.deliveryCost ||
                    0) as number;

                companyNet = data.orderData.paidAmount - deliveryAgentCost;
            } else if (orderData?.deliveryAgent) {
                deliveryAgentCost = (orderData?.deliveryAgent?.deliveryCost ||
                    0) as number;
                companyNet = data.orderData.paidAmount - deliveryAgentCost;
            }
        }

        const order = await prisma.order.update({
            where: {
                id: data.orderID
            },
            data: {
                paidAmount: data.orderData.paidAmount,
                clientNet: clientNet,
                deliveryAgentNet: deliveryAgentCost,
                companyNet: companyNet,
                discount: data.orderData.discount,
                recipientName: data.orderData.recipientName,
                recipientPhone: data.orderData.recipientPhone,
                recipientAddress: data.orderData.recipientAddress,
                notes: data.orderData.notes,
                currentLocation: data.orderData.currentLocation,
                status: data.orderData.status,
                details: data.orderData.details,
                deliveryDate: data.orderData.deliveryDate,
                deliveryAgent: data.orderData.deliveryAgentID
                    ? {
                          connect: {
                              id: data.orderData.deliveryAgentID
                          }
                      }
                    : undefined,
                repository: data.orderData.repositoryID
                    ? {
                          connect: {
                              id: data.orderData.repositoryID
                          }
                      }
                    : undefined,
                branch: data.orderData.branchID
                    ? {
                          connect: {
                              id: data.orderData.branchID
                          }
                      }
                    : undefined
            },
            select: orderSelect
        });
        return orderReform(order);
    }

    async deleteOrder(data: { orderID: number }) {
        const deletedOrder = await prisma.order.delete({
            where: {
                id: data.orderID
            }
        });
        return deletedOrder;
    }

    async deactivateOrder(data: { orderID: number; deletedByID: number }) {
        const deletedOrder = await prisma.order.update({
            where: {
                id: data.orderID
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
        return deletedOrder;
    }

    async reactivateOrder(data: { orderID: number }) {
        const deletedOrder = await prisma.order.update({
            where: {
                id: data.orderID
            },
            data: {
                deleted: false
            }
        });
        return deletedOrder;
    }

    async getAllOrdersStatuses() {
        const ordersStatuses = await prisma.order.groupBy({
            by: ["status"],
            _count: {
                status: true
            }
        });
        return ordersStatusesReformed(ordersStatuses);
    }

    async getTodayOrdersCountAndEarnings() {
        const todayOrdersCountAndEarnings = await prisma.order.aggregate({
            _sum: {
                totalCost: true,
                paidAmount: true
            },
            _count: {
                id: true
            },
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });
        return todayOrdersCountAndEarningsReformed(todayOrdersCountAndEarnings);
    }

    async getOrdersStatistics(filters: {
        // tenantID?: number;
        storeID?: number;
        recorded?: boolean;
        // status?: OrderStatus;
        startDate?: Date;
        endDate?: Date;
    }) {
        const filtersReformed = {
            AND: [
                // {
                //     tenantID: filters.tenantID
                // },
                {
                    storeId: filters.storeID
                },
                {
                    recorded: filters.recorded
                },
                // {
                //     status: filters.status
                // },
                {
                    createdAt: {
                        gte: filters.startDate
                    }
                },
                {
                    createdAt: {
                        lte: filters.endDate
                    }
                }
            ]
        };

        const ordersStatisticsByStatus = await prisma.order.groupBy({
            by: ["status"],
            _sum: {
                totalCost: true
            },
            _count: {
                id: true
            },
            where: {
                ...filtersReformed
            }
        });

        const ordersStatisticsByGovernorate = await prisma.order.groupBy({
            by: ["governorate"],
            _sum: {
                totalCost: true
            },
            _count: {
                id: true
            },
            where: {
                ...filtersReformed
            }
        });

        const allOrdersStatistics = await prisma.order.aggregate({
            _sum: {
                totalCost: true
            },
            _count: {
                id: true
            },
            where: {
                ...filtersReformed
            }
        });

        return statisticsReformed({
            ordersStatisticsByStatus,
            ordersStatisticsByGovernorate,
            allOrdersStatistics
        });
    }

    async getOrderTimeline(data: { orderID: number }) {
        const orderTimeline = await prisma.order.findUnique({
            where: {
                id: data.orderID
            },
            select: {
                timeline: true
            }
        });
        return orderTimeline;
    }

    async updateOrderTimeline(data: {
        orderID: number;
        timeline: OrderTimelineType;
    }) {
        const updatedOrderTimeline = await prisma.order.update({
            where: {
                id: data.orderID
            },
            data: {
                timeline: data.timeline
            },
            select: {
                timeline: true
            }
        });
        return updatedOrderTimeline;
    }

    async getOrderChatMembers(data: { orderID: number }) {
        const orderChatMembers = await prisma.order.findUnique({
            where: {
                id: data.orderID
            },
            select: {
                client: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                                avatar: true
                            }
                        }
                    }
                },
                deliveryAgent: {
                    select: {
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
        });
        return chatMembersReformed(orderChatMembers);
    }
}
