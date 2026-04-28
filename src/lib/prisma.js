let _prisma = null;

function getPrisma() {
  if (!_prisma) {
    // Lazy import to avoid build-time issues
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { Pool } = require("pg");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    _prisma = new PrismaClient({ adapter });
  }
  return _prisma;
}

const prisma = new Proxy({}, {
  get(_, prop) {
    return getPrisma()[prop];
  }
});

export { prisma };
export default prisma;
