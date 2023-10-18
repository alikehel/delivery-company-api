import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SECRET } from "../config/config";
// import Logger from "../lib/logger";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    // create two dummy articles
    const superAdmin = await prisma.user.upsert({
        where: { username: "superadmin" },
        update: {
            name: "Super Admin",
            username: "superadmin",
            password: bcrypt.hashSync("superadmin" + (SECRET as string), 12),
            phone: "01000000000",
            salary: 0,
            role: Role.SUPER_ADMIN
        },
        create: {
            name: "Super Admin",
            username: "superadmin",
            password: bcrypt.hashSync("superadmin" + (SECRET as string), 12),
            phone: "01000000000",
            salary: 0,
            role: Role.SUPER_ADMIN
        }
    });

    // const user2 = await prisma.user.create({
    //   data: {
    //     name: 'Wagih Mohamed',
    //     username: 'wagihmohamed',
    //     password: 'password',
    //   },
    // });

    console.log({ superAdmin });
    // Logger.info({ superAdmin });
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
