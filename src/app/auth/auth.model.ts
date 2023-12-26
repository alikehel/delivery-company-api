import { Prisma, PrismaClient } from "@prisma/client";
import { UserSigninType } from "./auth.zod";

const prisma = new PrismaClient();

const userSelect = {
    id: true,
    password: true,
    username: true,
    name: true,
    admin: {
        select: {
            role: true
        }
    },
    employee: {
        select: {
            role: true,
            permissions: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    logo: true
                }
            }
        }
    },
    client: {
        select: {
            role: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    logo: true
                }
            }
        }
    }
} satisfies Prisma.UserSelect;

const userReform = (
    user: Prisma.UserGetPayload<{
        select: typeof userSelect;
    }> | null
) => {
    if (!user) {
        return null;
    }
    return {
        id: user.id,
        username: user.username,
        password: user.password,
        name: user.name,
        companyName: user.employee
            ? user.employee.company.name
            : user.client
            ? user.client.company.name
            : null,
        admin: user.admin
            ? {
                  role: user.admin.role
              }
            : null,
        employee: user.employee
            ? {
                  role: user.employee.role,
                  permissions: user.employee.permissions,
                  company: {
                      id: user.employee.company.id,
                      name: user.employee.company.name,
                      logo: user.employee.company.logo
                  }
              }
            : null,
        client: user.client
            ? {
                  role: user.client.role,
                  company: {
                      id: user.client.company.id,
                      name: user.client.company.name,
                      logo: user.client.company.logo
                  }
              }
            : null
    };
};

export class AuthModel {
    async signin(user: UserSigninType) {
        const returnedUser = await prisma.user.findUnique({
            where: {
                username: user.username
            },
            select: userSelect
        });
        return userReform(returnedUser);
    }
}
