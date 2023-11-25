import {
    DeliveryType,
    Governorate,
    OrderStatus,
    Prisma,
    PrismaClient
} from "@prisma/client";
import AppError from "../../utils/AppError.util";
import { OrderCreateType, OrderUpdateType } from "./orders.zod";

const prisma = new PrismaClient();

const orderSelect: Prisma.OrderSelect = {
    id: true,
    totalCost: true,
    paidAmount: true,
    totalCostInUSD: true,
    paidAmountInUSD: true,
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
    clientReportReportNumber: true,
    repositoryReportReportNumber: true,
    branchReportReportNumber: true,
    // tenantReportReportNumber: true,
    deliveryAgentReportReportNumber: true,
    governorateReportReportNumber: true,
    companyReportReportNumber: true,
    company: {
        select: {
            id: true,
            name: true
        }
    }
};

const orderReform = (
    order: any
    //     Prisma.OrderGetPayload<{
    //     include: Prisma.OrderInclude;
    // }> | null
) => {
    if (!order) {
        return null;
    }
    return {
        ...order,
        // TODO
        client: {
            id: order.client.user.id,
            name: order.client.user.name,
            phone: order.client.user.phone
        },
        // client: order.client
        //     ? {
        //           id: order.client.user.id,
        //           name: order.client.user.name,
        //           phone: order.client.user.phone
        //       }
        //     : undefined,
        deliveryAgent: order.deliveryAgent
            ? {
                  id: order.deliveryAgent.user.id,
                  name: order.deliveryAgent.user.name,
                  phone: order.deliveryAgent.user.phone
              }
            : undefined
        // orderProducts: order.orderProducts.map((orderProduct: any) => {
        //     return {
        //         quantity: orderProduct.quantity,
        //         product: {
        //             id: orderProduct.product.id,
        //             title: orderProduct.product.title,
        //             price: orderProduct.product.price,
        //             weight: orderProduct.product.weight,
        //             image: orderProduct.product.image,
        //             createdAt: orderProduct.product.createdAt,
        //             updatedAt: orderProduct.product.updatedAt
        //         },
        //         color: orderProduct.color
        //             ? {
        //                   id: orderProduct.color.id,
        //                   title: orderProduct.color.title,
        //                   createdAt: orderProduct.color.createdAt,
        //                   updatedAt: orderProduct.color.updatedAt
        //               }
        //             : undefined,
        //         size: orderProduct.size
        //             ? {
        //                   id: orderProduct.size.id,
        //                   title: orderProduct.size.title,
        //                   createdAt: orderProduct.size.createdAt,
        //                   updatedAt: orderProduct.size.updatedAt
        //               }
        //             : undefined
        //     };
        // }),
        // location: order.location
        //     ? {
        //           id: order.location.id,
        //           name: order.location.name
        //       }
        //     : undefined,
        // store: order.store
        //     ? {
        //           id: order.store.id,
        //           name: order.store.name
        //       }
        //     : undefined,
        // clientReportReportNumber: order.clientReportReportNumber,
        // repositoryReportReportNumber: order.repositoryReportReportNumber,
        // branchReportReportNumber: order.branchReportReportNumber,
        // // tenantReportReportNumber: order.tenantReportReportNumber,
        // deliveryAgentReportReportNumber: order.deliveryAgentReportReportNumber,
        // governorateReportReportNumber: order.governorateReportReportNumber,
        // companyReportReportNumber: order.companyReportReportNumber
    };
};

const ordersStatusesReformed = (ordersStatuses: any[]) => {
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

const statisticsReformed = (statistics: any) => {
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
    todayOrdersCountAndEarnings: any
) => {
    const todayOrdersCountAndEarningsReformed = {
        count: todayOrdersCountAndEarnings._count.id,
        totalCost: todayOrdersCountAndEarnings._sum.totalCost || 0
    };

    return todayOrdersCountAndEarningsReformed;
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
                    throw new Error("Product not found");
                }
                totalCost += +productData.price * product.quantity;
                quantity += product.quantity;
                weight += productData.weight * product.quantity;
            }
        }

        // Check if products are available for the specific color and size
        if (data.withProducts == true) {
            for (const product of data.products) {
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
                            `المنتج ${product.productID} غير متوفر بهذا اللون`,
                            400
                        );
                    }

                    if (productColor.quantity < product.quantity) {
                        throw new AppError(
                            `الكمية المتاحة من المنتج ${product.productID} باللون ${productColor.color.title} هي ${productColor.quantity}`,
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
                            `المنتج ${product.productID} غير متوفر بهذا المقاس`,
                            400
                        );
                    }

                    if (productSize.quantity < product.quantity) {
                        throw new AppError(
                            `الكمية المتاحة من المنتج ${product.productID} بالمقاس ${productSize.size.title} هي ${productSize.quantity}`,
                            400
                        );
                    }
                }
            }
        }

        const createdOrder = await prisma.order.create({
            data: {
                totalCost:
                    data.withProducts === false ? data.totalCost : totalCost,
                quantity:
                    data.withProducts === false ? data.quantity : quantity,
                weight: data.withProducts === false ? data.weight : weight,
                recipientName: data.recipientName,
                recipientPhone: data.recipientPhone,
                recipientAddress: data.recipientAddress,
                notes: data.notes,
                details: data.details,
                deliveryType: data.deliveryType,
                governorate: data.governorate,
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
                        userId: clientID
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
            }
        }

        return orderReform(createdOrder);
    }

    async getOrdersCount() {
        const ordersCount = await prisma.order.count();
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
            status?: OrderStatus;
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
                        status: filters.status
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
        const order = await prisma.order.update({
            where: {
                id: data.orderID
            },
            data: {
                paidAmount: data.orderData.paidAmount,
                discount: data.orderData.discount,
                recipientName: data.orderData.recipientName,
                recipientPhone: data.orderData.recipientPhone,
                recipientAddress: data.orderData.recipientAddress,
                notes: data.orderData.notes,
                status: data.orderData.status,
                details: data.orderData.details,
                deliveryDate: data.orderData.deliveryDate,
                deliveryAgent: data.orderData.deliveryAgentID
                    ? {
                          connect: {
                              id: data.orderData.deliveryAgentID
                          }
                      }
                    : undefined
            },
            select: orderSelect
        });
        return orderReform(order);
    }

    async deleteOrder(data: { orderID: number }) {
        await prisma.order.delete({
            where: {
                id: data.orderID
            }
        });
        return true;
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
                paidAmount: true,
                totalCostInUSD: true,
                paidAmountInUSD: true
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
        tenantID?: number;
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

        // const ordersStatisticsByCategory = await prisma.order.groupBy({
        //     by: {
        //     },
        //     _sum: {
        //         totalCost: true
        //     },
        //     _count: {
        //         id: true
        //     },
        //     where: {
        //         ...filtersReformed
        //     }
        // });

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
        timeline: {
            type: string;
            old: string;
            new: string;
            date: Date;
        }[];
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
}
