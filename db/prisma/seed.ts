import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding the database...");

    const makes = [
        { name: "Toyota", slug: "toyota" },
        { name: "Ford", slug: "ford" },
        { name: "BMW", slug: "bmw" },
        { name: "Tesla", slug: "tesla" },
    ];

    for (const makeData of makes) {
        await prisma.make.create({
            data: makeData,
        });
    }

    console.log("Seeded Makes table");

    const toyota = await prisma.make.findFirst({ where: { slug: "toyota" } });
    const ford = await prisma.make.findFirst({ where: { slug: "ford" } });
    const bmw = await prisma.make.findFirst({ where: { slug: "bmw" } });
    const tesla = await prisma.make.findFirst({ where: { slug: "tesla" } });

    if (!toyota || !ford || !bmw || !tesla) {
        throw new Error("One or more makes not found");
    }

    const toyotaModels = [
        { name: "Corolla", slug: "corolla", makeId: toyota.id },
        { name: "Camry", slug: "camry", makeId: toyota.id },
    ];

    const fordModels = [
        { name: "Mustang", slug: "mustang", makeId: ford.id },
        { name: "F-150", slug: "f-150", makeId: ford.id },
    ];

    const bmwModels = [
        { name: "X5", slug: "x5", makeId: bmw.id },
        { name: "3 Series", slug: "3-series", makeId: bmw.id },
    ];

    const teslaModels = [
        { name: "Model S", slug: "model-s", makeId: tesla.id },
        { name: "Model 3", slug: "model-3", makeId: tesla.id },
    ];

    const models = [...toyotaModels, ...fordModels, ...bmwModels, ...teslaModels];

    for (const modelData of models) {
        await prisma.model.create({
            data: modelData,
        });
    }

    console.log("Seeded Models table");
}

main()
    .then(() => {
        console.log("Seeding completed.");
        prisma.$disconnect();
    })
    .catch((error) => {
        console.error("Error during seeding:", error);
        prisma.$disconnect();
        process.exit(1);
    });


