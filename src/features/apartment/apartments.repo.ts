import type { RequestQuery } from "./apartments.dto.js";
import prisma from "../../lib/prisma.js";

export class Repository {
  findMany = async ({ page, limit, searchKeyword }: RequestQuery) => {
    const skip = (page - 1) * limit;
    const where =
      searchKeyword && Object.entries(searchKeyword).length > 0
        ? {
            OR: Object.entries(searchKeyword).map(([key, value]) => ({
              [key]: {
                contains: value,
                mode: "insensitive",
              },
            })),
          }
        : {};
    const totalCount = await prisma.apartment.count({ where });
    const data = await prisma.apartment.findMany({
      where,
      take: limit,
      skip,
    });
    return { data, totalCount };
  };

  findOne = async (id: string) => {
    const apt = await prisma.apartment.findUnique({
      where: {
        id,
      },
    });
    return apt;
  };
}
