import type { RequestQuery } from "./apartments.dto.js";
import prisma from "../../lib/prisma.js";

export class Repository {
  findMany = async ({ searchKeyword }: RequestQuery) => {
    const where =
      searchKeyword && Object.entries(searchKeyword).length > 0
        ? {
            OR: Object.entries(searchKeyword).map(([key, value]) => ({
              [key]: {
                contains: value,
                mode: "strict",
              },
            })),
          }
        : {};
    const apts = await prisma.apartment.findMany({
      where
    });
    return apts
  };

  findOne = async ( id: string ) => {
    const apt = await prisma.apartment.findUnique({
        where: {
            id
        },

    })
    return apt;
  };
}
