import { Prisma, PrismaClient } from "@prisma/client";
import { calculatePagesCount, calculateSkip } from "../lib/pagination";

export const prisma = new PrismaClient()
    .$extends({
        name: "findManyAndCount",
        model: {
            $allModels: {
                findManyAndCount<Model, Args>(
                    this: Model,
                    args: Prisma.Exact<Args, Prisma.Args<Model, "findMany">>
                ): Promise<[Prisma.Result<Model, Args, "findMany">, number]> {
                    return prisma.$transaction([
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (this as any).findMany(args),
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (this as any).count({ where: (args as any).where })
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    ]) as any;
                }
            }
        }
    })
    .$extends({
        name: "findManyPaginated",
        model: {
            $allModels: {
                async findManyPaginated<Model, Args>(
                    this: Model,
                    args: Prisma.Exact<Args, Prisma.Args<Model, "findMany">>,
                    pagination: { page: number; size: number }
                ): Promise<{
                    data: Prisma.Result<Model, Args, "findMany">;
                    dataCount: number;
                    pagesCount: number;
                    currentPage: number;
                }> {
                    const data = (await prisma.$transaction([
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (this as any).findMany({
                            ...(args as object),
                            skip: calculateSkip(pagination.page, pagination.size),
                            take: pagination.size
                        }),
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (this as any).count({ where: (args as any).where })
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    ])) as any;
                    return {
                        data: data[0],
                        dataCount: data[1],
                        pagesCount: calculatePagesCount(data[1], pagination.size),
                        currentPage: pagination.page
                    };
                }
            }
        }
    });
