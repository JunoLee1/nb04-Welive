import prisma from "../src/lib/prisma.js";
import bcrypt from "bcrypt";

const main = async () => {
  const hashedPassword = await bcrypt.hash("12345678", 10);

  const juno = await prisma.user.upsert({
    where: {
      email: "juno@test.com",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "Juno12",
      email: "juno@test.com",
      password: hashedPassword,
      name: "Juno",
      contact: "01011112222",
      role: "SUPER_ADMIN",
      joinStatus: "APPROVED",
    },
  });
  const Hana = await prisma.user.upsert({
    where: {
      email: "hana@test.com",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "hana12",
      email: "hana@test.com",
      password: hashedPassword,
      name: "Hana Lee",
      contact: "010022225232",
      role: "ADMIN",
      joinStatus: "APPROVED",
    },
  });

  const Chloe = await prisma.user.upsert({
    where: {
      email: "chloe1@test.com",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      username: "Chloe961",
      email: "chloe1@test.com",
      password: "12345678",
      name: "Chloe Lee",
      contact: "01000015232",
      role: "USER",
      joinStatus: "APPROVED",
    },
  });


  await prisma.apartment.upsert({
    where: {
      adminId: Hana.id,
    },
    update: {
      name: "sk view 아파트",
      address: "부산광역시 수영구 망미동",
      description: "수영동 sk view아파트 입니다",
      buildingNumberFrom: 2,
      buildingNumberTo: 5,
      floorCountPerBuilding: 1,
      unitCountPerFloor: 2,
      officeNumber: "051000111",
    },
    create: {
      adminId:Hana.id,
      name: "sk view 아파트",
      address: "부산광역시 수영구 망미동",
      description: "수영동 sk view아파트 입니다",
      buildingNumberFrom: 2,
      buildingNumberTo: 5,
      floorCountPerBuilding: 1,
      unitCountPerFloor: 2,
      officeNumber: "051000111",
    },
  });
  await prisma.apartment.upsert({
    where: {
      adminId: juno.id,
    },
    update: {},
    create: {
      adminId:juno.id,
      name: "sk view2 아파트",
      address: "부산광역시 수영구 망미동",
      description: "수영동 sk view아파트 입니다",
      buildingNumberFrom: 1,
      buildingNumberTo: 4,
      floorCountPerBuilding: 1,
      unitCountPerFloor: 1,
      officeNumber: "051000111",
    },
  });
  await prisma.resident.upsert({
    where: {
      userId: Chloe.id,
    },
    update: {
      userId: Chloe.id,
      name: "자이 아파트",
      isHouseholder: true,
      building: 101,
      unit: 1001,
    },
    create: {
      userId: Chloe.id,
      name: "자이 아파트",
      apartmentId: "604603d5-4012-4bd2-8254-d47ef4659669",
      isHouseholder: true,
      building: 101,
      unit: 1001,
    },
  });
};
await main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
