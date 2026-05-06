const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  try {
    console.log('Prisma client keys:');
    console.log(Object.keys(p).sort().join('\n'));
  } catch (e) {
    console.error(e);
  } finally {
    await p.$disconnect();
  }
})();
