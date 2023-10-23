import { PrismaClient } from "@prisma/client";
import { ProductCreateType, ProductUpdateType } from "./products.zod";

const prisma = new PrismaClient();

// model Product {
//   id             String           @id @default(uuid())
//   title          String
//   price          Decimal
//   createdAt      DateTime         @default(now())
//   updatedAt      DateTime         @updatedAt
//   image          String?
//   stock          Int              @default(0)
// }

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
                            title: data.category || "أخري"
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
                                        title: color.title || "أخري"
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
                                        title: size.title || "أخري"
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
            select: {
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
                            select: {
                                title: true
                            }
                        }
                    }
                },
                ProductSizes: {
                    select: {
                        quantity: true,
                        size: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
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
            select: {
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
                            select: {
                                title: true
                            }
                        }
                    }
                },
                ProductSizes: {
                    select: {
                        quantity: true,
                        size: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
        });
        return products;
    }

    async getProduct(data: { productID: string }) {
        const product = await prisma.product.findUnique({
            where: {
                id: data.productID
            },
            select: {
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
                            select: {
                                title: true
                            }
                        }
                    }
                },
                ProductSizes: {
                    select: {
                        quantity: true,
                        size: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
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
                            title: data.productData.category || "أخري"
                        },
                        create: {
                            title: data.productData.category || "أخري"
                        }
                    }
                }
                // ProductColors: {
                //     update: {
                //         where: {
                //             productId: data.productID
                //         },
                //         data: data.productData.colors?.map((color) => {
                //             return {
                //                 quantity: color.quantity,
                //                 color: {
                //                     connectOrCreate: {
                //                         where: {
                //                             title: color.title || "أخري"
                //                         },
                //                         create: {
                //                             title: color.title || "أخري"
                //                         }
                //                     }
                //                 }
                //             };
                //         })
                //     }
                // },
                // ProductSizes: {
                //     create: data.productData.sizes?.map((size) => {
                //         return {
                //             quantity: size.quantity,
                //             size: {
                //                 connectOrCreate: {
                //                     where: {
                //                         title: size.title || "أخري"
                //                     },
                //                     create: {
                //                         title: size.title || "أخري"
                //                     }
                //                 }
                //             }
                //         };
                //     })
                // }
            },
            select: {
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
                            select: {
                                title: true
                            }
                        }
                    }
                },
                ProductSizes: {
                    select: {
                        quantity: true,
                        size: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
        });
        return product;
    }

    async deleteProduct(data: { productID: string }) {
        await prisma.productColors.deleteMany({
            where: {
                productId: data.productID
            }
        });
        await prisma.productSizes.deleteMany({
            where: {
                productId: data.productID
            }
        });
        const deletedProduct = await prisma.product.delete({
            where: {
                id: data.productID
            }
        });
        return deletedProduct;
    }
}
