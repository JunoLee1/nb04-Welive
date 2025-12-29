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
      adminOf: {
        create: {
          name: "sk view2 아파트",
          address: "부산광역시 수영구 망미동",
          description: "수영동 sk view아파트 입니다",
          buildingNumberFrom: 1,
          buildingNumberTo: 4,
          floorCountPerBuilding: 1,
          unitCountPerFloor: 1,
          officeNumber: "051000111",
        },
      },
    },
  });

  const Chloe = await prisma.user.upsert({
    where: {
      email: "chloe1@test.com",
    },
    update: {
      password: hashedPassword,
      resident: {
      upsert: {
        create: {
          name: "자이 아파트",
          apartmentId: "b63fcbee-0b62-480b-8276-40c4bcf59b71",
          building: 101,
          unit: 1001,
          isHouseholder: true,
        },
        update: {
          name: "자이 아파트",
          building: 101,
          unit: 1001,
          isHouseholder: true,
        },
      }
    }
    },
    create: {
      username: "Chloe961",
      email: "Chloe1@test.com",
      password: "12345678",
      name: "Chloe Lee",
      contact: "01000015232",
      role: "USER",
      joinStatus: "APPROVED",
      resident: {
        create: {
          apartmentId: "b63fcbee-0b62-480b-8276-40c4bcf59b71",
          building: 101,
          unit: 1001,
          isHouseholder: true,
          name: "자이 아파트",
        },
      },
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
