import {
    DeliveryType,
    Governorate,
    OrderStatus,
    Prisma,
    PrismaClient
} from "@prisma/client";
import {
    OrderCreateType,
    OrderUpdateType,
    OrdersRecordGetType
} from "./orders.zod";

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
    client: {
        select: {
            id: true,
            name: true,
            phone: true
        }
    },
    deliveryAgent: {
        select: {
            id: true,
            name: true,
            phone: true
        }
    },
    OrderProducts: {
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
    }
};

export class OrderModel {
    async createOrder(clientID: string, data: OrderCreateType) {
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
                // client: {
                //     connect: {
                //         // id: clientID
                //         // TODO: Remove this hard-coded clientID
                //         // id: "da3074e8-bb89-4c68-bb8b-cee34db87999"
                //         id: "b3ca03c2-3630-42a1-a433-f803242212b7"
                //     }
                // },
                OrderProducts:
                    data.withProducts === false
                        ? undefined
                        : {
                              create: data.products.map((product) => {
                                  return {
                                      quantity: product.quantity,
                                      size: product.size
                                          ? {
                                                connect: {
                                                    title: product.size
                                                }
                                            }
                                          : undefined,
                                      color: product.color
                                          ? {
                                                connect: {
                                                    title: product.color
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
        return createdOrder;
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
            deliveryAgentID?: string;
            clientID?: string;
            storeID?: string;
            // repositoryID?: string;
            productID?: string;
            locationID?: string;
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
                        deliveryDate: filters.deliveryDate
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
                        OrderProducts: filters.productID
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
        return orders;
    }

    async getOrdersByIDs(ordersIDs: OrdersRecordGetType) {
        const orders = await prisma.order.findMany({
            // where: {
            //     id: {
            //         in: ordersIDs.ordersIDs
            //     }
            // },
            select: orderSelect
        });
        return orders;
    }

    async getOrder(data: { orderID: string }) {
        const order = await prisma.order.findUnique({
            where: {
                id: data.orderID
            },
            select: orderSelect
        });
        return order;
    }

    async updateOrder(data: { orderID: string; orderData: OrderUpdateType }) {
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
        return order;
    }

    async deleteOrder(data: { orderID: string }) {
        const deletedOrder = await prisma.order.delete({
            where: {
                id: data.orderID
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
        return ordersStatuses;
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
        return todayOrdersCountAndEarnings;
    }

    async getOrdersStatistics(filters: {
        tenantID?: string;
        storeID?: string;
        recorded?: boolean;
        status?: OrderStatus;
    }) {
        const ordersStatistics = await prisma.order.aggregate({
            where: {
                AND: [
                    // {
                    //     tenantID: filters.tenantID
                    // },
                    {
                        storeId: filters.storeID
                    },
                    {
                        recorded: filters.recorded
                    }
                ]
            },
            _sum: {
                totalCost: true
            },
            _count: {
                id: true
            }
        });

        console.log("ordersStatistics");

        return ordersStatistics;
    }
}
