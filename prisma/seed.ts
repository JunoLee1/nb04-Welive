import prisma from "../src/lib/prisma.js";

const main = async () => {
  const Alice = await prisma.user.upsert({
    where: {
      email: "Alice@test.com",
    },
    update: {},
    create: {
      username: "alice12",
      email: "Alice@test.com",
      password: "12345678",
      name: "Alice",
      contact: "01000000000",
      role: "SUPER_ADMIN",
      approvedAt: null,
    },
  });
  const Hana = await prisma.user.upsert({
    where: {
      email: "hana@test.com",
    },
    update: {},
    create: {
      username: "hana12",
      email: "hana@test.com",
      password: "12345678",
      name: "Hana Lee",
      contact: "01000000000",
      role: "ADMIN",
      joinStatus:"APPROVED",
      approvedAt: null,
      adminOf: {
        create: {
          name: "sk view 아파트",
          address: "부산광역시 수영구 망미동",
          description: "수영동 sk view아파트 입니다",
          buildingNumberFrom: 1,
          buildingNumberTo: 4,
          floorCountPerBuilding: 1,
          unitCountPerFloor: 1,
          officeNumber: "0510000000",
        },
      },
    },
  });
  /*
  const Chloe = await prisma.user.upsert({
    where: {
      email: "chloe@test.com",
    },
    update: {},
    create: {
      id: "3",
      username: "Chloe96",
      email: "Chloe@test.com",
      password: "12345678",
      name: "Chloe Lee",
      contact: "01000000000",
      role: "USER",
      approvedAt: "",
      joinStatus:"APPROVED",
      adminOf:{
        create:{

        }
      }
    },
  });
  */
};
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
