import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create admin user
  const adminEmail = 'admin@accplan.com';
  const adminPassword = 'Admin@12345';

  const existingAdmin = await prisma.users.findUnique({
    where: { email: adminEmail },
  });

  let adminUser;
  if (existingAdmin) {
    console.log('✓ Admin user already exists:', adminEmail);
    adminUser = existingAdmin;
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    adminUser = await prisma.users.create({
      data: {
        id: uuid(),
        first_name: 'Admin',
        last_name: 'User',
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log('✓ Admin user created:');
    console.log(`  📧 Email: ${adminEmail}`);
    console.log(`  🔐 Password: ${adminPassword}\n`);
  }

  // Create sample business
  const businessName = 'AccPlan Demo Business';
  const existingBusiness = await prisma.businesses.findFirst({
    where: { name: businessName },
  });

  let business;
  if (existingBusiness) {
    console.log('✓ Sample business already exists:', businessName);
    business = existingBusiness;
  } else {
    business = await prisma.businesses.create({
      data: {
        id: uuid(),
        name: businessName,
        legal_name: 'AccPlan Demo Business LLC',
        tax_id: 'TAX123456789',
        country: 'United States',
        city: 'San Francisco',
      },
    });
    console.log('✓ Sample business created:');
    console.log(`  🏢 Name: ${business.name}`);
    console.log(`  📍 Location: ${business.city}, ${business.country}\n`);
  }

  // Assign admin user to business as OWNER
  const existingAssignment = await prisma.business_users.findUnique({
    where: {
      business_id_user_id: {
        business_id: business.id,
        user_id: adminUser.id,
      },
    },
  });

  if (existingAssignment) {
    console.log('✓ Admin is already assigned to business as:', existingAssignment.role);
  } else {
    const businessUser = await prisma.business_users.create({
      data: {
        id: uuid(),
        business_id: business.id,
        user_id: adminUser.id,
        role: 'OWNER',
      },
    });
    console.log('✓ Admin assigned to business:');
    console.log(`  👤 Role: ${businessUser.role}\n`);
  }

  // Create fiscal year
  const currentYear = new Date().getFullYear();
  const existingFiscalYear = await prisma.fiscal_years.findFirst({
    where: {
      business_id: business.id,
      name: currentYear.toString(),
    },
  });

  let fiscalYear;
  if (existingFiscalYear) {
    console.log('✓ Fiscal year already exists:', currentYear);
    fiscalYear = existingFiscalYear;
  } else {
    fiscalYear = await prisma.fiscal_years.create({
      data: {
        id: uuid(),
        business_id: business.id,
        name: currentYear.toString(),
        start_date: new Date(`${currentYear}-01-01`),
        end_date: new Date(`${currentYear}-12-31`),
        status: 'OPEN',
      },
    });
    console.log(`✓ Fiscal year created: ${currentYear}\n`);
  }

  // Create chart of accounts
  const accountsData = [
    { code: '1000', name: 'Cash', type: 'ASSET' },
    { code: '1100', name: 'Accounts Receivable', type: 'ASSET' },
    { code: '1200', name: 'Inventory', type: 'ASSET' },
    { code: '1500', name: 'Fixed Assets', type: 'ASSET' },
    { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
    { code: '2100', name: 'Short-term Debt', type: 'LIABILITY' },
    { code: '3000', name: 'Owner Equity', type: 'EQUITY' },
    { code: '4000', name: 'Sales Revenue', type: 'INCOME' },
    { code: '5000', name: 'Cost of Goods Sold', type: 'EXPENSE' },
    { code: '5100', name: 'Operating Expenses', type: 'EXPENSE' },
  ];

  console.log('Creating chart of accounts...');
  let accountsCreated = 0;
  for (const accountData of accountsData) {
    const existingAccount = await prisma.accounts.findFirst({
      where: {
        business_id: business.id,
        code: accountData.code,
      },
    });

    if (!existingAccount) {
      await prisma.accounts.create({
        data: {
          id: uuid(),
          business_id: business.id,
          code: accountData.code,
          name: accountData.name,
          type: accountData.type as any,
        },
      });
      accountsCreated++;
    }
  }
  console.log(`✓ Chart of accounts ready: ${accountsData.length} accounts\n`);

  // Create categories
  const categoriesData = [
    { name: 'Office Supplies', description: 'Office and general supplies' },
    { name: 'Travel', description: 'Travel and transportation expenses' },
    { name: 'Utilities', description: 'Utilities and services' },
    { name: 'Professional Services', description: 'Consulting and professional fees' },
    { name: 'Equipment', description: 'Equipment and machinery' },
  ];

  console.log('Creating expense categories...');
  for (const categoryData of categoriesData) {
    const existingCategory = await prisma.categories.findFirst({
      where: {
        business_id: business.id,
        name: categoryData.name,
      },
    });

    if (!existingCategory) {
      await prisma.categories.create({
        data: {
          business_id: business.id,
          name: categoryData.name,
        },
      });
    }
  }
  console.log(`✓ Expense categories created: ${categoriesData.length} categories\n`);

  // Create warehouses
  const warehousesData = [
    { name: 'Main Warehouse', location: 'San Francisco, CA' },
    { name: 'Secondary Warehouse', location: 'Oakland, CA' },
  ];

  console.log('Creating warehouses...');
  for (const warehouseData of warehousesData) {
    const existingWarehouse = await prisma.warehouses.findFirst({
      where: {
        business_id: business.id,
        name: warehouseData.name,
      },
    });

    if (!existingWarehouse) {
      await prisma.warehouses.create({
        data: {
          id: uuid(),
          business_id: business.id,
          name: warehouseData.name,
          location: warehouseData.location,
        },
      });
    }
  }
  console.log(`✓ Warehouses created: ${warehousesData.length} warehouses\n`);

  // Create products
  const productsData = [
    { name: 'Widget A', sku: 'WID-A-001', unit_price: 29.99 },
    { name: 'Widget B', sku: 'WID-B-001', unit_price: 49.99 },
    { name: 'Gadget X', sku: 'GAD-X-001', unit_price: 99.99 },
    { name: 'Service Bundle', sku: 'SVC-BUN-001', unit_price: 199.99 },
  ];

  console.log('Creating products...');
  for (const productData of productsData) {
    const existingProduct = await prisma.products.findFirst({
      where: {
        business_id: business.id,
        sku: productData.sku,
      },
    });

    if (!existingProduct) {
      await prisma.products.create({
        data: {
          id: uuid(),
          business_id: business.id,
          name: productData.name,
          sku: productData.sku,
          unit_price: productData.unit_price,
        },
      });
    }
  }
  console.log(`✓ Products created: ${productsData.length} products\n`);

  // Create contacts
  const contactsData = [
    { name: 'Acme Corp', type: 'SUPPLIER', email: 'contact@acmecorp.com' },
    { name: 'Tech Solutions Inc', type: 'SUPPLIER', email: 'sales@techsolutions.com' },
    { name: 'Customer A', type: 'CUSTOMER', email: 'buyer@customera.com' },
    { name: 'Customer B', type: 'CUSTOMER', email: 'orders@customerb.com' },
  ];

  console.log('Creating contacts...');
  for (const contactData of contactsData) {
    const existingContact = await prisma.contacts.findFirst({
      where: {
        business_id: business.id,
        name: contactData.name,
      },
    });

    if (!existingContact) {
      await prisma.contacts.create({
        data: {
          id: uuid(),
          business_id: business.id,
          name: contactData.name,
          type: contactData.type as any,
          email: contactData.email,
        },
      });
    }
  }
  console.log(`✓ Contacts created: ${contactsData.length} contacts\n`);

  console.log('✅ Database seed completed successfully!\n');
  console.log('📋 Admin Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔗 To login, POST to /auth/login:');
  console.log(`   { "email": "${adminEmail}", "password": "${adminPassword}" }\n`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
