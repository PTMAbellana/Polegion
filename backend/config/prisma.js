const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// For soft delete functionality, we'll handle it in the repository layer instead
// since $use middleware is deprecated in newer Prisma versions

module.exports = prisma;