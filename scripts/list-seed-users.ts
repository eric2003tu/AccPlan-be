import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      system_role: true,
      business_users: {
        select: {
          role: true,
          business: {
            select: { name: true, legal_name: true, tax_id: true, country: true, city: true },
          },
        },
      },
    },
    orderBy: { email: 'asc' },
  });

  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
