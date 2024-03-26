import { Prisma } from "@prisma/client";
import { prisma } from "../../database/db";
import { ProductCreateType, ProductUpdateType } from "./products.zod";

const productSelect = {
    id: true,
    title: true,
    price: true,
    image: true,
    stock: true,
    weight: true,
    store: {
        select: {
            id: true,
            name: true
        }
    },
    category: {
        select: {
            title: true
        }
    },
    productColors: {
        select: {
            quantity: true,
            color: {
                select: { id: true, title: true, code: true }
            }
        }
    },
    productSizes: {
        select: {
            quantity: true,
            size: {
                select: { id: true, title: true }
            }
        }
    },
    company: {
        select: {
            id: true,
            name: true
        }
    }
} satisfies Prisma.ProductSelect;

// const productSelectReform = (product: Prisma.ProductGetPayload<typeof productSelect>) => {
//     return {
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         image: product.image,
//         stock: product.stock,
//         weight: product.weight,
//         category: product.category.title,
//         colors: product.productColors.map((color) => {
//             return {
//                 id: color.color.id,
//                 title: color.color.title,
//                 quantity: color.quantity
//             };
//         }),
//         sizes: product.productSizes.map((size) => {
//             return {
//                 id: size.size.id,
//                 title: size.size.title,
//                 quantity: size.quantity
//             };
//         })
//     };
// };

export class ProductModel {
    async createProduct(companyID: number, clientID: number, data: ProductCreateType) {
        const createdProduct = await prisma.product.create({
            data: {
                title: data.title,
                price: data.price,
                image: data.image,
                stock: data.stock,
                store: {
                    connect: {
                        id: data.storeID
                    }
                },
                client: {
                    connect: {
                        id: clientID
                    }
                },
                category: {
                    connect: {
                        id: data.categoryID
                        // create: {
                        //     company: {
                        //         connect: {
                        //             id: companyID
                        //         }
                        //     },
                        //     title: data.category || "أخري"
                        // }
                    }
                },
                productColors: {
                    create: data.colors?.map((color) => {
                        return {
                            quantity: color.quantity,
                            color: {
                                connect: {
                                    id: color.colorID
                                    // create: {
                                    //     company: {
                                    //         connect: {
                                    //             id: companyID
                                    //         }
                                    //     },
                                    //     title: color.title || "أخري"
                                    // }
                                }
                            }
                        };
                    })
                },
                productSizes: {
                    create: data.sizes?.map((size) => {
                        return {
                            quantity: size.quantity,
                            size: {
                                connect: {
                                    id: size.sizeID
                                }
                                //     create: {
                                //         company: {
                                //             connect: {
                                //                 id: companyID
                                //             }
                                //         },
                                //         title: size.title || "أخري"
                                //     }
                                // }
                            }
                        };
                    })
                },
                company: {
                    connect: {
                        id: companyID
                    }
                }
            },
            select: productSelect
        });
        return createdProduct;
    }

    async getProductsCount(filters: {
        storeID?: number;
        companyID?: number;
    }) {
        const productsCount = await prisma.product.count({
            where: {
                AND: [
                    {
                        store: {
                            id: filters.storeID
                        }
                    },
                    {
                        company: {
                            id: filters.companyID
                        }
                    }
                ]
            }
        });
        return productsCount;
    }

    async getAllProducts(
        skip: number,
        take: number,
        filters: {
            storeID?: number;
            companyID?: number;
            minified?: boolean;
        }
    ) {
        const where = {
            AND: [
                {
                    store: {
                        id: filters.storeID
                    }
                },
                {
                    company: {
                        id: filters.companyID
                    }
                }
            ]
        };

        if (filters.minified === true) {
            const products = await prisma.product.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    title: true,
                    price: true,
                    stock: true,
                    productColors: {
                        select: {
                            quantity: true,
                            color: {
                                select: {
                                    id: true,
                                    title: true
                                }
                            }
                        }
                    },
                    productSizes: {
                        select: {
                            quantity: true,
                            size: {
                                select: {
                                    id: true,
                                    title: true
                                }
                            }
                        }
                    }
                }
            });
            return products;
        }

        const products = await prisma.product.findMany({
            skip: skip,
            take: take,
            where: where,
            orderBy: {
                id: "desc"
            },
            select: productSelect
        });

        return products;
    }

    async getProduct(data: { productID: number }) {
        const product = await prisma.product.findUnique({
            where: {
                id: data.productID
            },
            select: productSelect
        });
        return product;
    }

    async updateProduct(data: {
        productID: number;
        companyID: number;
        loggedInUserID: number;
        productData: ProductUpdateType;
    }) {
        const product = await prisma.product.update({
            where: {
                id: data.productID
            },
            data: {
                title: data.productData.title,
                price: data.productData.price,
                image: data.productData.image,
                stock: data.productData.stock,
                store: data.productData.storeID
                    ? {
                          connect: {
                              id: data.productData.storeID
                          }
                      }
                    : undefined,
                // client: {
                //     connect: {
                //         id: data.loggedInUserID
                //     }
                // },
                category: data.productData.categoryID
                    ? {
                          connect: {
                              id: data.productData.categoryID
                              // create: {
                              //     company: {
                              //         connect: {
                              //             id: data.companyID
                              //         }
                              //     },
                              //     title: data.productData.category || "أخري"
                              // }
                          }
                      }
                    : undefined
            },
            //     ProductColors: {
            //         update: data.productData.colors?.map((color) => {
            //             return {
            //                 where: {
            //                     productId_colorId: {
            //                         productId: data.productID,
            //                         colorId: color.colorID
            //                     }
            //                 },
            //                 data: {
            //                     quantity: color.quantity,
            //                     color: {
            //                         connectOrCreate: {
            //                             where: {
            //                                 id: color.colorID
            //                             },
            //                             create: {
            //                                 title: color.title || "أخري"
            //                             }
            //                         }
            //                     }
            //                 }
            //             };
            //         })
            //     },
            //     ProductSizes: {
            //         update: data.productData.sizes?.map((size) => {
            //             return {
            //                 where: {
            //                     productId_sizeId: {
            //                         productId: data.productID,
            //                         sizeId: size.sizeID
            //                     }
            //                 },
            //                 data: {
            //                     quantity: size.quantity,
            //                     size: {
            //                         connectOrCreate: {
            //                             where: {
            //                                 id: size.sizeID
            //                             },
            //                             create: {
            //                                 title: size.title || "أخري"
            //                             }
            //                         }
            //                     }
            //                 }
            //             };
            //         })
            //     }
            // },
            select: productSelect
        });
        return product;
    }

    async deleteProduct(data: { productID: number }) {
        const deletedProductColors = prisma.productColors.deleteMany({
            where: {
                productId: data.productID
            }
        });

        const deletedProductSizes = prisma.productSizes.deleteMany({
            where: {
                productId: data.productID
            }
        });

        const deletedProduct = prisma.product.delete({
            where: {
                id: data.productID
            }
        });

        await prisma.$transaction([deletedProductColors, deletedProductSizes, deletedProduct]);

        return true;
    }
}
