import { PrismaClient } from "@prisma/client";
import { ProductCreateType, ProductUpdateType } from "./products.zod";

const prisma = new PrismaClient();

const productSelect = {
    id: true,
    title: true,
    price: true,
    image: true,
    stock: true,
    Category: {
        select: {
            title: true
        }
    },
    ProductColors: {
        select: {
            quantity: true,
            color: {
                select: { id: true, title: true }
            }
        }
    },
    ProductSizes: {
        select: {
            quantity: true,
            size: {
                select: { id: true, title: true }
            }
        }
    }
};

export class ProductModel {
    async createProduct(data: ProductCreateType) {
        const createdProduct = await prisma.product.create({
            data: {
                title: data.title,
                price: data.price,
                image: data.image,
                stock: data.stock,
                Category: {
                    connectOrCreate: {
                        where: {
                            title: data.category
                        },
                        create: {
                            title: data.category || "أخري"
                        }
                    }
                },
                ProductColors: {
                    create: data.colors?.map((color) => {
                        return {
                            quantity: color.quantity,
                            color: {
                                connectOrCreate: {
                                    where: {
                                        title: color.title
                                    },
                                    create: {
                                        title: color.title || "أخري"
                                    }
                                }
                            }
                        };
                    })
                },
                ProductSizes: {
                    create: data.sizes?.map((size) => {
                        return {
                            quantity: size.quantity,
                            size: {
                                connectOrCreate: {
                                    where: {
                                        title: size.title
                                    },
                                    create: {
                                        title: size.title || "أخري"
                                    }
                                }
                            }
                        };
                    })
                }
            },
            select: productSelect
        });
        return createdProduct;
    }

    async getProductsCount() {
        const productsCount = await prisma.product.count();
        return productsCount;
    }

    async getAllProducts(skip: number, take: number) {
        const products = await prisma.product.findMany({
            skip: skip,
            take: take,
            orderBy: {
                title: "desc"
            },
            select: productSelect
        });
        return products;
    }

    async getProduct(data: { productID: string }) {
        const product = await prisma.product.findUnique({
            where: {
                id: data.productID
            },
            select: productSelect
        });
        return product;
    }

    async updateProduct(data: {
        productID: string;
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
                Category: {
                    connectOrCreate: {
                        where: {
                            title: data.productData.category
                        },
                        create: {
                            title: data.productData.category || "أخري"
                        }
                    }
                }
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

    async deleteProduct(data: { productID: string }) {
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

        await prisma.$transaction([
            deletedProductColors,
            deletedProductSizes,
            deletedProduct
        ]);

        return true;
    }
}
