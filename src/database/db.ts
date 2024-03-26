import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient().$extends({
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
});
