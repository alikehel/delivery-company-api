import { EmployeeRole, Governorate, OrderStatus, Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import {
    OrderCreateType,
    OrderTimelineType,
    OrderUpdateType,
    OrdersFiltersType,
    OrdersStatisticsFiltersType
} from "./orders.dto";
import { orderReform, orderSelect, statisticsReformed } from "./orders.responses";

const prisma = new PrismaClient();

export class OrdersRepository {
    async createOrder(data: { companyID: number; clientID: number; orderData: OrderCreateType }) {
        let totalCost = 0;
        let quantity = 0;
        let weight = 0;

        if (data.orderData.withProducts === true) {
            for (const product of data.orderData.products) {
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
        if (data.orderData.withProducts === true) {
            for (const product of data.orderData.products) {
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
                        throw new AppError(`المنتج (${productTitle}) غير متوفر بهذا اللون`, 400);
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
                        throw new AppError(`المنتج (${productTitle}) غير متوفر بهذا المقاس`, 400);
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
                        throw new AppError(`المنتج (${productTitle}) غير متوفر`, 400);
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
                id: data.clientID
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
                        return governorateDeliveryCost.governorate === data.orderData.governorate;
                    }
                )?.cost || 0;
        }

        const createdOrder = await prisma.order.create({
            data: {
                totalCost: data.orderData.withProducts === false ? data.orderData.totalCost : totalCost,
                deliveryCost: deliveryCost,
                quantity: data.orderData.withProducts === false ? data.orderData.quantity : quantity,
                weight: data.orderData.withProducts === false ? data.orderData.weight : weight,
                recipientName: data.orderData.recipientName,
                recipientPhones: data.orderData.recipientPhones
                    ? data.orderData.recipientPhones
                    : data.orderData.recipientPhone
                      ? [data.orderData.recipientPhone]
                      : undefined,
                receiptNumber: data.orderData.receiptNumber,
                recipientAddress: data.orderData.recipientAddress,
                notes: data.orderData.notes,
                details: data.orderData.details,
                deliveryType: data.orderData.deliveryType,
                governorate: data.orderData.governorate,
                branch: data.orderData.branchID
                    ? {
                          connect: {
                              id: data.orderData.branchID
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
                location: data.orderData.locationID
                    ? {
                          connect: {
                              id: data.orderData.locationID
                          }
                      }
                    : undefined,
                store: {
                    connect: {
                        id: data.orderData.storeID
                    }
                },
                company: {
                    connect: {
                        id: data.companyID
                    }
                },
                client: {
                    connect: {
                        id: data.clientID
                    }
                },
                confirmed: data.orderData.confirmed,
                orderProducts:
                    data.orderData.withProducts === false
                        ? undefined
                        : {
                              create: data.orderData.products.map((product) => {
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
        if (data.orderData.withProducts === true) {
            for (const product of data.orderData.products) {
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

    async getOrdersCount(data: { filters: OrdersFiltersType }) {
        const ordersCount = await prisma.order.count({
            where: {
                AND: [
                    // Search by receiptNumber, recipientName, recipientPhone, recipientAddress
                    {
                        OR: [
                            {
                                receiptNumber: data.filters.search
                                    ? Number.isNaN(+data.filters.search)
                                        ? undefined
                                        : data.filters.search.length > 9
                                          ? undefined
                                          : +data.filters.search
                                    : undefined
                            },
                            {
                                repositoryReportId: data.filters.search
                                    ? Number.isNaN(+data.filters.search)
                                        ? undefined
                                        : data.filters.search.length > 9
                                          ? undefined
                                          : +data.filters.search
                                    : undefined
                            },
                            {
                                branchReportId: data.filters.search
                                    ? Number.isNaN(+data.filters.search)
                                        ? undefined
                                        : data.filters.search.length > 9
                                          ? undefined
                                          : +data.filters.search
                                    : undefined
                            },
                            {
                                deliveryAgentReportId: data.filters.search
                                    ? Number.isNaN(+data.filters.search)
                                        ? undefined
                                        : data.filters.search.length > 9
                                          ? undefined
                                          : +data.filters.search
                                    : undefined
                            },
                            {
                                governorateReportId: data.filters.search
                                    ? Number.isNaN(+data.filters.search)
                                        ? undefined
                                        : data.filters.search.length > 9
                                          ? undefined
                                          : +data.filters.search
                                    : undefined
                            },
                            {
                                companyReportId: data.filters.search
                                    ? Number.isNaN(+data.filters.search)
                                        ? undefined
                                        : data.filters.search.length > 9
                                          ? undefined
                                          : +data.filters.search
                                    : undefined
                            },
                            {
                                clientReportId: data.filters.search
                                    ? Number.isNaN(+data.filters.search)
                                        ? undefined
                                        : data.filters.search.length > 9
                                          ? undefined
                                          : +data.filters.search
                                    : undefined
                            },
                            {
                                recipientName: {
                                    contains: data.filters.search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                recipientPhones: data.filters.search
                                    ? {
                                          has: data.filters.search
                                      }
                                    : undefined
                            },
                            {
                                recipientAddress: {
                                    contains: data.filters.search,
                                    mode: "insensitive"
                                }
                            }
                        ]
                    },
                    // Filter by companyID
                    {
                        company: {
                            id: data.filters.companyID
                        }
                    },
                    // Filter by orderID
                    {
                        id: data.filters.orderID
                    },
                    // Filter by status
                    {
                        status: { in: data.filters.statuses }
                    },
                    {
                        status: data.filters.status
                    },
                    // Filter by deliveryType
                    {
                        deliveryType: data.filters.deliveryType
                    },
                    // Filter by deliveryDate
                    {
                        // gte deliveryDate day start time (00:00:00) and lte deliveryDate day end time (23:59:59)
                        deliveryDate: data.filters.deliveryDate
                            ? {
                                  gte: new Date(new Date(data.filters.deliveryDate).setHours(0, 0, 0, 0)),
                                  lte: new Date(new Date(data.filters.deliveryDate).setHours(23, 59, 59, 999))
                              }
                            : undefined
                    },
                    // Filter by governorate
                    {
                        governorate: data.filters.governorate
                    },
                    // Filter by deliveryAgentID
                    {
                        deliveryAgent: {
                            id: data.filters.deliveryAgentID
                        }
                    },
                    // Filter by clientID
                    {
                        client: {
                            id: data.filters.clientID
                        }
                    },
                    // Filter by storeID
                    {
                        store: {
                            id: data.filters.storeID
                        }
                    },
                    // Filter by repositoryID
                    {
                        repository: {
                            id: data.filters.repositoryID
                        }
                    },
                    // {
                    //     OrderProducts: {
                    //         some: {
                    //             product: {
                    //                 repository: {
                    //                     id: data.filters.repositoryID
                    //                 }
                    //             }
                    //         }
                    //     }
                    // },
                    // Filter by productID
                    {
                        orderProducts: data.filters.productID
                            ? {
                                  some: {
                                      product: {
                                          id: data.filters.productID
                                      }
                                  }
                              }
                            : undefined
                    },
                    // Filter by locationID
                    {
                        location: {
                            id: data.filters.locationID
                        }
                    },
                    // Filter by receiptNumber
                    {
                        receiptNumber: data.filters.receiptNumber
                    },
                    // Filter by recipientName
                    {
                        recipientName: data.filters.recipientName
                    },
                    // Filter by recipientPhone
                    {
                        recipientPhones: data.filters.recipientPhone
                            ? {
                                  has: data.filters.recipientPhone
                              }
                            : undefined
                    },
                    // Filter by recipientAddress
                    {
                        recipientAddress: data.filters.recipientAddress
                    },
                    // Filter by notes
                    {
                        notes: data.filters.notes
                    },
                    // Filter by startDate
                    {
                        createdAt: {
                            gte: data.filters.startDate
                        }
                    },
                    // Filter by endDate
                    {
                        createdAt: {
                            lte: data.filters.endDate
                        }
                    },
                    // Filter by deleted
                    {
                        deleted: data.filters.deleted
                    },
                    // Filter by clientReport
                    {
                        clientReport:
                            data.filters.clientReport === "true"
                                ? { isNot: null }
                                : data.filters.clientReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by repositoryReport
                    {
                        repositoryReport:
                            data.filters.repositoryReport === "true"
                                ? { isNot: null }
                                : data.filters.repositoryReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by branchReport
                    {
                        branchReport:
                            data.filters.branchReport === "true"
                                ? { isNot: null }
                                : data.filters.branchReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by deliveryAgentReport
                    {
                        deliveryAgentReport:
                            data.filters.deliveryAgentReport === "true"
                                ? { isNot: null }
                                : data.filters.deliveryAgentReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by governorateReport
                    {
                        governorateReport:
                            data.filters.governorateReport === "true"
                                ? { isNot: null }
                                : data.filters.governorateReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by companyReport
                    {
                        companyReport:
                            data.filters.companyReport === "true"
                                ? { isNot: null }
                                : data.filters.companyReport === "false"
                                  ? { is: null }
                                  : undefined
                    },
                    // Filter by automaticUpdateID
                    {
                        automaticUpdate: {
                            id: data.filters.automaticUpdateID
                        }
                    },
                    {
                        branch: {
                            id: data.filters.branchID
                        }
                    },
                    {
                        repository: {
                            id: data.filters.repositoryID
                        }
                    }
                ]
            }
        });

        return ordersCount;
    }

    async getAllOrders(data: { skip: number; take: number; filters: OrdersFiltersType }) {
        const where = {
            AND: [
                // Search by receiptNumber, recipientName, recipientPhone, recipientAddress
                {
                    OR: [
                        {
                            receiptNumber: data.filters.search
                                ? Number.isNaN(+data.filters.search)
                                    ? undefined
                                    : data.filters.search.length > 9
                                      ? undefined
                                      : +data.filters.search
                                : undefined
                        },
                        {
                            repositoryReportId: data.filters.search
                                ? Number.isNaN(+data.filters.search)
                                    ? undefined
                                    : data.filters.search.length > 9
                                      ? undefined
                                      : +data.filters.search
                                : undefined
                        },
                        {
                            branchReportId: data.filters.search
                                ? Number.isNaN(+data.filters.search)
                                    ? undefined
                                    : data.filters.search.length > 9
                                      ? undefined
                                      : +data.filters.search
                                : undefined
                        },
                        {
                            deliveryAgentReportId: data.filters.search
                                ? Number.isNaN(+data.filters.search)
                                    ? undefined
                                    : data.filters.search.length > 9
                                      ? undefined
                                      : +data.filters.search
                                : undefined
                        },
                        {
                            governorateReportId: data.filters.search
                                ? Number.isNaN(+data.filters.search)
                                    ? undefined
                                    : data.filters.search.length > 9
                                      ? undefined
                                      : +data.filters.search
                                : undefined
                        },
                        {
                            companyReportId: data.filters.search
                                ? Number.isNaN(+data.filters.search)
                                    ? undefined
                                    : data.filters.search.length > 9
                                      ? undefined
                                      : +data.filters.search
                                : undefined
                        },
                        {
                            clientReportId: data.filters.search
                                ? Number.isNaN(+data.filters.search)
                                    ? undefined
                                    : data.filters.search.length > 9
                                      ? undefined
                                      : +data.filters.search
                                : undefined
                        },
                        {
                            recipientName: {
                                contains: data.filters.search,
                                mode: "insensitive"
                            }
                        },
                        {
                            recipientPhones: data.filters.search
                                ? {
                                      has: data.filters.search
                                  }
                                : undefined
                        },
                        {
                            recipientAddress: {
                                contains: data.filters.search,
                                mode: "insensitive"
                            }
                        }
                    ]
                },
                // Filter by companyID
                {
                    company: {
                        id: data.filters.companyID
                    }
                },
                {
                    confirmed: data.filters.confirmed
                },
                // Filter by orderID
                {
                    id: data.filters.orderID
                },
                // Filter by status
                {
                    status: { in: data.filters.statuses }
                },
                {
                    status: data.filters.status
                },
                // Filter by deliveryType
                {
                    deliveryType: data.filters.deliveryType
                },
                // Filter by deliveryDate
                {
                    // gte deliveryDate day start time (00:00:00) and lte deliveryDate day end time (23:59:59)
                    deliveryDate: data.filters.deliveryDate
                        ? {
                              gte: new Date(new Date(data.filters.deliveryDate).setHours(0, 0, 0, 0)),
                              lte: new Date(new Date(data.filters.deliveryDate).setHours(23, 59, 59, 999))
                          }
                        : undefined
                },
                // Filter by governorate
                {
                    governorate: data.filters.governorate
                },
                // Filter by deliveryAgentID
                {
                    deliveryAgent: {
                        id: data.filters.deliveryAgentID
                    }
                },
                // Filter by clientID
                {
                    client: {
                        id: data.filters.clientID
                    }
                },
                // Filter by storeID
                {
                    store: {
                        id: data.filters.storeID
                    }
                },
                // Filter by repositoryID
                {
                    repository: {
                        id: data.filters.repositoryID
                    }
                },
                // {
                //     OrderProducts: {
                //         some: {
                //             product: {
                //                 repository: {
                //                     id: data.filters.repositoryID
                //                 }
                //             }
                //         }
                //     }
                // },
                // Filter by productID
                {
                    orderProducts: data.filters.productID
                        ? {
                              some: {
                                  product: {
                                      id: data.filters.productID
                                  }
                              }
                          }
                        : undefined
                },
                // Filter by locationID
                {
                    location: {
                        id: data.filters.locationID
                    }
                },
                // Filter by receiptNumber
                {
                    receiptNumber: data.filters.receiptNumber
                },
                // Filter by recipientName
                {
                    recipientName: data.filters.recipientName
                },
                // Filter by recipientPhone
                {
                    recipientPhones: data.filters.recipientPhone
                        ? {
                              has: data.filters.recipientPhone
                          }
                        : undefined
                },
                // Filter by recipientAddress
                {
                    recipientAddress: data.filters.recipientAddress
                },
                // Filter by notes
                {
                    notes: data.filters.notes
                },
                // Filter by startDate
                {
                    createdAt: {
                        gte: data.filters.startDate
                    }
                },
                // Filter by endDate
                {
                    createdAt: {
                        lte: data.filters.endDate
                    }
                },
                // Filter by deleted
                {
                    deleted: data.filters.deleted
                },
                // Filter by clientReport
                {
                    clientReport:
                        data.filters.clientReport === "true"
                            ? { isNot: null }
                            : data.filters.clientReport === "false"
                              ? { is: null }
                              : undefined
                },
                // Filter by repositoryReport
                {
                    repositoryReport:
                        data.filters.repositoryReport === "true"
                            ? { isNot: null }
                            : data.filters.repositoryReport === "false"
                              ? { is: null }
                              : undefined
                },
                // Filter by branchReport
                {
                    branchReport:
                        data.filters.branchReport === "true"
                            ? { isNot: null }
                            : data.filters.branchReport === "false"
                              ? { is: null }
                              : undefined
                },
                // Filter by deliveryAgentReport
                {
                    deliveryAgentReport:
                        data.filters.deliveryAgentReport === "true"
                            ? { isNot: null }
                            : data.filters.deliveryAgentReport === "false"
                              ? { is: null }
                              : undefined
                },
                // Filter by governorateReport
                {
                    governorateReport:
                        data.filters.governorateReport === "true"
                            ? { isNot: null }
                            : data.filters.governorateReport === "false"
                              ? { is: null }
                              : undefined
                },
                // Filter by companyReport
                {
                    companyReport:
                        data.filters.companyReport === "true"
                            ? { isNot: null }
                            : data.filters.companyReport === "false"
                              ? { is: null }
                              : undefined
                },
                // Filter by automaticUpdateID
                {
                    automaticUpdate: {
                        id: data.filters.automaticUpdateID
                    }
                },
                {
                    branch: {
                        id: data.filters.branchID
                    }
                },
                {
                    repository: {
                        id: data.filters.repositoryID
                    }
                }
            ]
        } satisfies Prisma.OrderWhereInput;

        if (data.filters.minified === true) {
            const orders = await prisma.order.findMany({
                skip: data.skip,
                take: data.take,
                where: where,
                select: {
                    id: true
                }
            });
            return { orders: orders };
        }

        const orders = await prisma.order.findMany({
            skip: data.skip,
            take: data.take,
            where: where,
            orderBy: {
                [data.filters.sort.split(":")[0]]: data.filters.sort.split(":")[1] === "desc" ? "desc" : "asc"
            },
            select: orderSelect
        });

        const ordersMetaDataAggregate = await prisma.order.aggregate({
            where: where,
            _count: {
                id: true
            },
            _sum: {
                totalCost: true,
                paidAmount: true,
                clientNet: true,
                deliveryAgentNet: true,
                companyNet: true,
                deliveryCost: true
            }
        });

        const ordersMetaDataGroupByStatus = await prisma.order.groupBy({
            where: where,
            by: ["status"],
            _count: {
                status: true
            }
        });

        const ordersReformed = orders.map(orderReform);

        const ordersMetaDataGroupByStatusReformed = (
            Object.keys(OrderStatus) as Array<keyof typeof OrderStatus>
        ).map((status) => {
            const statusCount = ordersMetaDataGroupByStatus.find((orderStatus: { status: string }) => {
                return orderStatus.status === status;
            });

            return {
                status: status,
                count: statusCount?._count?.status || 0
            };
        });

        const ordersMetaDataReformed = {
            count: ordersMetaDataAggregate._count.id,
            totalCost: ordersMetaDataAggregate._sum.totalCost || 0,
            paidAmount: ordersMetaDataAggregate._sum.paidAmount || 0,
            clientNet: ordersMetaDataAggregate._sum.clientNet || 0,
            deliveryAgentNet: ordersMetaDataAggregate._sum.deliveryAgentNet || 0,
            companyNet: ordersMetaDataAggregate._sum.companyNet || 0,
            deliveryCost: ordersMetaDataAggregate._sum.deliveryCost || 0,
            countByStatus: ordersMetaDataGroupByStatusReformed
        };

        return {
            orders: ordersReformed,
            ordersMetaData: ordersMetaDataReformed
        };
    }

    async getOrdersByIDs(data: { ordersIDs: number[] }) {
        const orders = await prisma.order.findMany({
            where: {
                id: {
                    in: data.ordersIDs
                }
            },
            orderBy: {
                id: "asc"
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
        let deliveryAgentCost = 0;
        let companyNet = 0;
        let clientNet = 0;
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
                deliveryAgentCost = (orderDeliveryAgent?.deliveryCost || 0) as number;

                companyNet = data.orderData.paidAmount - deliveryAgentCost;
            } else if (orderData?.deliveryAgent) {
                deliveryAgentCost = (orderData?.deliveryAgent?.deliveryCost || 0) as number;
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
                recipientPhones: data.orderData.recipientPhones
                    ? data.orderData.recipientPhones
                    : data.orderData.recipientPhone
                      ? [data.orderData.recipientPhone]
                      : undefined,
                recipientAddress: data.orderData.recipientAddress,
                notes: data.orderData.notes,
                currentLocation: data.orderData.currentLocation,
                status: data.orderData.status,
                secondaryStatus: data.orderData.secondaryStatus,
                confirmed: data.orderData.confirmed,
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
                    : undefined,
                client: data.orderData.clientID
                    ? {
                          connect: {
                              id: data.orderData.clientID
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

    async getOrdersStatistics(data: {
        filters: OrdersStatisticsFiltersType;
    }) {
        const filtersReformed = {
            AND: [
                {
                    company: {
                        id: data.filters.companyID
                    }
                },
                {
                    storeId: data.filters.storeID
                },
                {
                    clientReport: data.filters.clientReport
                        ? { isNot: null }
                        : data.filters.clientReport
                          ? { is: null }
                          : undefined
                },
                {
                    governorateReport: data.filters.governorateReport
                        ? { isNot: null }
                        : data.filters.governorateReport
                          ? { is: null }
                          : undefined
                },
                {
                    branchReport: data.filters.branchReport
                        ? { isNot: null }
                        : data.filters.branchReport
                          ? { is: null }
                          : undefined
                },
                {
                    deliveryAgentReport: data.filters.deliveryAgentReport
                        ? { isNot: null }
                        : data.filters.deliveryAgentReport
                          ? { is: null }
                          : undefined
                },
                {
                    repositoryReport: data.filters.repositoryReport
                        ? { isNot: null }
                        : data.filters.repositoryReport
                          ? { is: null }
                          : undefined
                },
                {
                    companyReport: data.filters.companyReport
                        ? { isNot: null }
                        : data.filters.companyReport
                          ? { is: null }
                          : undefined
                },
                {
                    status: { in: data.filters.statuses }
                },
                {
                    governorate: data.filters.governorate
                },
                {
                    createdAt: {
                        gte: data.filters.startDate
                    }
                },
                {
                    createdAt: {
                        lte: data.filters.endDate
                    }
                },
                {
                    client: {
                        id: data.filters.clientID
                    }
                },
                {
                    deliveryType: data.filters.deliveryType
                },
                {
                    location: {
                        id: data.filters.locationID
                    }
                },
                {
                    deliveryAgent: {
                        id: data.filters.deliveryAgentID
                    }
                }
            ]
        } satisfies Prisma.OrderWhereInput;

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

        const allOrdersStatisticsWithoutClientReport = await prisma.order.aggregate({
            _sum: {
                totalCost: true
            },
            _count: {
                id: true
            },
            where: {
                ...filtersReformed,
                clientReport: {
                    is: null
                }
            }
        });

        const todayOrdersStatistics = await prisma.order.aggregate({
            _sum: {
                totalCost: true
            },
            _count: {
                id: true
            },
            where: {
                ...filtersReformed,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        return statisticsReformed({
            ordersStatisticsByStatus,
            ordersStatisticsByGovernorate,
            allOrdersStatistics,
            allOrdersStatisticsWithoutClientReport,
            todayOrdersStatistics
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
        /*
            chatMembers:
                CLIENT
                DELIVERY_AGENT
                RECEIVING_AGENT
                BRANCH_MANAGER
                INQUIRY_EMPLOYEE
        */
        const orderChatMembers = await prisma.order.findUnique({
            where: {
                id: data.orderID
            },
            select: {
                client: {
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
                },
                deliveryAgent: {
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
                },
                branch: {
                    select: {
                        employees: {
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
                            },
                            where: {
                                role: {
                                    in: [EmployeeRole.BRANCH_MANAGER, EmployeeRole.INQUIRY_EMPLOYEE]
                                }
                            }
                        }
                    }
                }
            }
        });

        // array of chat members with no nulls

        if (!orderChatMembers) {
            throw new AppError("الطلب غير موجود", 404);
        }

        const chatMembers = [
            orderChatMembers?.client && {
                id: orderChatMembers?.client?.user?.id,
                name: orderChatMembers?.client?.user?.name,
                phone: orderChatMembers?.client?.user?.phone,
                avatar: orderChatMembers?.client?.user?.avatar,
                role: orderChatMembers?.client?.role
            },
            orderChatMembers?.deliveryAgent && {
                id: orderChatMembers?.deliveryAgent?.user?.id,
                name: orderChatMembers?.deliveryAgent?.user?.name,
                phone: orderChatMembers?.deliveryAgent?.user?.phone,
                avatar: orderChatMembers?.deliveryAgent?.user?.avatar,
                role: orderChatMembers?.deliveryAgent?.role
            },
            ...(orderChatMembers?.branch?.employees?.map((employee) => {
                return {
                    id: employee.user?.id ?? null,
                    name: employee.user?.name ?? null,
                    phone: employee.user?.phone ?? null,
                    avatar: employee.user?.avatar ?? null,
                    role: employee.role ?? null
                };
            }) ?? [])
        ].filter((chatMember) => {
            return chatMember !== null;
        });

        return chatMembers;
    }

    async getClientIDByStoreID(data: { storeID: number }) {
        const store = await prisma.store.findUnique({
            where: {
                id: data.storeID
            },
            select: {
                clientId: true
            }
        });
        return store?.clientId;
    }
}
