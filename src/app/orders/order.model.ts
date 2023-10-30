import {
    DeliveryType,
    Governorate,
    OrderStatus,
    PrismaClient
} from "@prisma/client";
import { OrderCreateType, OrderUpdateType } from "./orders.zod";

const prisma = new PrismaClient();

const orderSelect = {
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
    details: true,
    notes: true,
    status: true,
    deliveryType: true,
    deliveryDate: true,
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
    async createOrder(data: OrderCreateType) {
        const createdOrder = await prisma.order.create({
            data: {
                totalCost: data.totalCost,
                paidAmount: data.paidAmount,
                totalCostInUSD: data.totalCostInUSD,
                paidAmountInUSD: data.paidAmountInUSD,
                discount: data.discount,
                receiptNumber: data.receiptNumber,
                quantity: data.quantity,
                weight: data.weight,
                recipientName: data.recipientName,
                recipientPhone: data.recipientPhone,
                recipientAddress: data.recipientAddress,
                details: data.details,
                notes: data.notes,
                status: data.status,
                deliveryType: data.deliveryType,
                deliveryDate: data.deliveryDate,
                governorate: data.governorate,
                location: data.locationID
                    ? {
                          connect: {
                              id: data.locationID
                          }
                      }
                    : undefined,
                store: data.storeID
                    ? {
                          connect: {
                              id: data.storeID
                          }
                      }
                    : undefined,
                client: {
                    connect: {
                        id: data.clientID
                    }
                },
                deliveryAgent: {
                    connect: {
                        id: data.deliveryAgentID
                    }
                },
                OrderProducts: {
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
                totalCost: data.orderData.totalCost,
                paidAmount: data.orderData.paidAmount,
                totalCostInUSD: data.orderData.totalCostInUSD,
                paidAmountInUSD: data.orderData.paidAmountInUSD,
                discount: data.orderData.discount,
                receiptNumber: data.orderData.receiptNumber,
                quantity: data.orderData.quantity,
                weight: data.orderData.weight,
                recipientName: data.orderData.recipientName,
                recipientPhone: data.orderData.recipientPhone,
                recipientAddress: data.orderData.recipientAddress,
                details: data.orderData.details,
                notes: data.orderData.notes,
                status: data.orderData.status,
                deliveryType: data.orderData.deliveryType,
                deliveryDate: data.orderData.deliveryDate,
                client: data.orderData.clientID
                    ? {
                          connect: {
                              id: data.orderData.clientID
                          }
                      }
                    : undefined,
                deliveryAgent: data.orderData.deliveryAgentID
                    ? {
                          connect: {
                              id: data.orderData.deliveryAgentID
                          }
                      }
                    : undefined,
                OrderProducts: data.orderData.products
                    ? {
                          create: data.orderData.products.map((product) => {
                              return {
                                  quantity: product.quantity,
                                  product: {
                                      connect: {
                                          id: product.productID
                                      }
                                  }
                              };
                          })
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
}
