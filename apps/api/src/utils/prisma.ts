import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;
import { PrismaClient } from "../generated/prisma/index.js";


console.log("DATABASE_URL TERDETEKSI:", process.env.DATABASE_URL ? "YA" : "TIDAK");

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });