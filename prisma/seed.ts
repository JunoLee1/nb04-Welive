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

  // =============================== ADMINS ==================================//
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

  const Christine = await prisma.user.upsert({
    where: { email: "christinaFan@test.com" },
    update: { password: hashedPassword },
    create: {
      username: "christina",
      name: "Christine Oh",
      password: "12345678",
      role: "ADMIN",
      joinStatus: "APPROVED",
      email: "christinaFan@test.com",
      contact: "01055558888",
    },
  });
  // =============================== APARTMENT ==================================//

  const LotteCastle = await prisma.apartment.upsert({
    where: {
      adminId: Christine.id,
    },
    update: {},
    create: {
      adminId: Christine.id,
      name: "Lotte Castle",
      address: "부산광역시 수영구 수영로325번길 61",
      description: "수영동 롯데캐슬 아파트 입니다",
      buildings: [101, 102],
      floorCountPerBuilding: 1,
      unitCountPerFloor: 2,
      officeNumber: "051112222",
    },
  });
  const SkViewApartment = await prisma.apartment.upsert({
    where: {
      adminId: Hana.id,
    },
    update: {
      name: "sk view 아파트",
      address: "부산광역시 수영구 망미동",
      description: "수영동 sk view아파트 입니다",
      buildings: [101, 102],
      units: [1001, 1002, 1003, 1004],
      floorCountPerBuilding: 1,
      unitCountPerFloor: 2,
      officeNumber: "051000111",
    },
    create: {
      adminId: Hana.id,
      name: "sk view 아파트",
      address: "부산광역시 수영구 망미동",
      description: "수영동 sk view아파트 입니다",
      buildings: [101, 102],
      units: [1001, 1002, 1003, 1004],
      floorCountPerBuilding: 1,
      unitCountPerFloor: 2,
      officeNumber: "051000111",
    },
  });
  await prisma.apartment.upsert({
    where: {
      adminId: juno.id,
    },
    update: {
      buildings: [101, 102, 103],
      units: [1001, 1002, 1003, 1004],
    },
    create: {
      adminId: juno.id,
      name: "sk view2 아파트",
      address: "부산광역시 수영구 망미동",
      description: "수영동 sk view아파트 입니다",
      buildings: [101, 102, 103],
      units: [1001, 1002, 1003, 1004],
      floorCountPerBuilding: 1,
      unitCountPerFloor: 1,
      officeNumber: "051000111",
    },
  });

  // =============================== USER ==================================//
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

  const Paullet = await prisma.user.upsert({
    where: {
      email: "paulet@test.com",
    },
    update: { password: hashedPassword },
    create: {
      username: "paullet",
      email: "paulet@test.com",
      password: "12345678",
      name: "Paullet Mija",
      role: "USER",
      joinStatus: "PENDING",
      contact: "01033335555",
    },
  });
  const Doopy = await prisma.user.upsert({
    where: {
      email: "dowon@test.com",
    },
    update: { password: hashedPassword },
    create: {
      username: "dowon",
      email: "dowon@test.com",
      password: "12345678",
      name: "dowon lee",
      role: "USER",
      joinStatus: "PENDING",
      contact: "01033334455",
    },
  });

  await prisma.resident.upsert({
    where: {
      userId_apartmentId: {
        userId: Chloe.id,
        apartmentId: SkViewApartment.id,
      },
    },
    update: {
      userId: Chloe.id,
      name: "sk 아파트",
      isHouseholder: true,
      building: "101",
      unit: "1001",
    },
    create: {
      userId: Chloe.id,
      name: "sk 아파트",
      apartmentId: SkViewApartment.id,
      isHouseholder: true,
      building: "101",
      unit: "1001",
    },
  });

  await prisma.resident.upsert({
    where: {
      userId: Paullet.id,
    },
    update: {
      building: "102",
      unit: "1002",
    },
    create: {
      userId: Paullet.id,
      name: "Lotte Castle",
      apartmentId: LotteCastle.id,
      isHouseholder: true,
      building: "102",
      unit: "1002",
    },
  });

  await prisma.resident.upsert({
    where: {
      userId_apartmentId: {
        userId: Doopy.id,
        apartmentId: SkViewApartment.id,
      },
    },
    update: {
      building: "103",
      unit: "1002",
    },
    create: {
      userId: Doopy.id,
      name: "Sk View 아파트",
      apartmentId: SkViewApartment.id,
      isHouseholder: true,
      building: "103",
      unit: "1003",
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
