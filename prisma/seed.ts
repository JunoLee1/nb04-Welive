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
      approvedAt: null,
      joinStatus: "APPROVED"
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
      contact: "010022221111",
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
          officeNumber: "051000111",
        },
      },
    },
  });
  
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
      approvedAt: null,
      joinStatus:"APPROVED",
      resident:{
        create:{
          isHouseholder:true,
          name:"자이아파트",
          unit:1,
          building:1
        }
      }
    },
  });
};
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
