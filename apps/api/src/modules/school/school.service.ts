import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const schoolService = {
 
  getAll: async () => {
    return await prisma.school.findMany();
  },

 
  getById: async (id: string) => {
    return await prisma.school.findUnique({
      where: { id },
    });
  },


  create: async (data: { name: string; address: string }) => {
    return await prisma.school.create({
      data,
    });
  },

  update: async (id: string, data: { name: string; address: string }) => {
    return await prisma.school.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return await prisma.school.delete({
      where: { id },
    });
  },
};
