import { PrismaClient, business_users_role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

type SeedUser = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

type SeedBusiness = {
  name: string;
  legal_name: string;
  tax_id: string;
  country: string;
  city: string;
  ownerEmail: string;
  managerEmail: string;
};

const seededUsers: SeedUser[] = [
  { first_name: 'Admin', last_name: 'User', email: 'admin@accplan.com', password: 'Admin@12345' },
  { first_name: 'Eric', last_name: 'Tuyishime', email: 'eric.tuyishime@accplan.com', password: 'User@12345' },
  { first_name: 'Ketia', last_name: 'Isimbi', email: 'ketia.isimbi@accplan.com', password: 'User@12345' },
  { first_name: 'Jean', last_name: 'Claude', email: 'jean.claude@accplan.com', password: 'User@12345' },
  { first_name: 'Alice', last_name: 'Mutesi', email: 'alice.mutesi@accplan.com', password: 'User@12345' },
  { first_name: 'Olivier', last_name: 'Habimana', email: 'olivier.habimana@accplan.com', password: 'User@12345' },
  { first_name: 'Diane', last_name: 'Mukamana', email: 'diane.mukamana@accplan.com', password: 'User@12345' },
  { first_name: 'Patrick', last_name: 'Niyonzima', email: 'patrick.niyonzima@accplan.com', password: 'User@12345' },
  { first_name: 'Sandra', last_name: 'Uwase', email: 'sandra.uwase@accplan.com', password: 'User@12345' },
  { first_name: 'Kevin', last_name: 'Rukundo', email: 'kevin.rukundo@accplan.com', password: 'User@12345' },
];

const seededBusinesses: SeedBusiness[] = [
  {
    name: 'AccPlan Holdings Ltd',
    legal_name: 'AccPlan Holdings Limited',
    tax_id: 'TAX-ACC-1001',
    country: 'Rwanda',
    city: 'Kigali',
    ownerEmail: 'admin@accplan.com',
    managerEmail: 'eric.tuyishime@accplan.com',
  },
  {
    name: 'Kigali Traders Ltd',
    legal_name: 'Kigali Traders Limited',
    tax_id: 'TAX-KIG-1002',
    country: 'Rwanda',
    city: 'Kigali',
    ownerEmail: 'ketia.isimbi@accplan.com',
    managerEmail: 'jean.claude@accplan.com',
  },
  {
    name: 'Greenfield Supplies Ltd',
    legal_name: 'Greenfield Supplies Limited',
    tax_id: 'TAX-GRN-1003',
    country: 'Kenya',
    city: 'Nairobi',
    ownerEmail: 'alice.mutesi@accplan.com',
    managerEmail: 'olivier.habimana@accplan.com',
  },
  {
    name: 'Horizon Services Ltd',
    legal_name: 'Horizon Services Limited',
    tax_id: 'TAX-HZN-1004',
    country: 'Uganda',
    city: 'Kampala',
    ownerEmail: 'diane.mukamana@accplan.com',
    managerEmail: 'patrick.niyonzima@accplan.com',
  },
  {
    name: 'Mount View Manufacturing Ltd',
    legal_name: 'Mount View Manufacturing Limited',
    tax_id: 'TAX-MNT-1005',
    country: 'Tanzania',
    city: 'Dar es Salaam',
    ownerEmail: 'sandra.uwase@accplan.com',
    managerEmail: 'kevin.rukundo@accplan.com',
  },
  {
    name: 'Sunrise Retail Ltd',
    legal_name: 'Sunrise Retail Limited',
    tax_id: 'TAX-SUN-1006',
    country: 'Rwanda',
    city: 'Musanze',
    ownerEmail: 'admin@accplan.com',
    managerEmail: 'alice.mutesi@accplan.com',
  },
  {
    name: 'BlueStone Logistics Ltd',
    legal_name: 'BlueStone Logistics Limited',
    tax_id: 'TAX-BLU-1007',
    country: 'Rwanda',
    city: 'Rubavu',
    ownerEmail: 'eric.tuyishime@accplan.com',
    managerEmail: 'diane.mukamana@accplan.com',
  },
];

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

const categoriesData = [
  'Office Supplies',
  'Travel',
  'Utilities',
  'Professional Services',
  'Equipment',
];

const warehousesData = [
  { name: 'Main Warehouse', location: 'Central Hub' },
  { name: 'Secondary Warehouse', location: 'Regional Site' },
];

const productsData = [
  { name: 'Widget A', sku: 'WID-A-001', unit_price: 29.99 },
  { name: 'Widget B', sku: 'WID-B-001', unit_price: 49.99 },
  { name: 'Gadget X', sku: 'GAD-X-001', unit_price: 99.99 },
  { name: 'Service Bundle', sku: 'SVC-BUN-001', unit_price: 199.99 },
];

const contactsData = [
  { name: 'Acme Corp', type: 'SUPPLIER', email: 'contact@acmecorp.com' },
  { name: 'Tech Solutions Inc', type: 'SUPPLIER', email: 'sales@techsolutions.com' },
  { name: 'Customer A', type: 'CUSTOMER', email: 'buyer@customera.com' },
  { name: 'Customer B', type: 'CUSTOMER', email: 'orders@customerb.com' },
];

async function upsertUser(user: SeedUser) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const existingUser = await prisma.users.findUnique({ where: { email: user.email } });

  if (existingUser) {
    return prisma.users.update({
      where: { email: user.email },
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        password: hashedPassword,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });
  }

  return prisma.users.create({
    data: {
      id: uuid(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
    },
  });
}

async function upsertBusiness(business: SeedBusiness) {
  const existingBusiness = await prisma.businesses.findFirst({ where: { name: business.name } });

  if (existingBusiness) {
    return prisma.businesses.update({
      where: { id: existingBusiness.id },
      data: {
        name: business.name,
        legal_name: business.legal_name,
        tax_id: business.tax_id,
        country: business.country,
        city: business.city,
      },
    });
  }

  return prisma.businesses.create({
    data: {
      id: uuid(),
      name: business.name,
      legal_name: business.legal_name,
      tax_id: business.tax_id,
      country: business.country,
      city: business.city,
    },
  });
}

async function upsertBusinessUser(businessId: string, userId: string, role: business_users_role) {
  const existingAssignment = await prisma.business_users.findFirst({
    where: {
      business_id: businessId,
      user_id: userId,
    },
  });

  if (existingAssignment) {
    return prisma.business_users.update({
      where: { id: existingAssignment.id },
      data: { role },
    });
  }

  return prisma.business_users.create({
    data: {
      id: uuid(),
      business_id: businessId,
      user_id: userId,
      role,
    },
  });
}

async function seedBusinessData(businessId: string) {
  const currentYear = new Date().getFullYear();
  const fiscalYearName = currentYear.toString();
  const existingFiscalYear = await prisma.fiscal_years.findFirst({
    where: {
      business_id: businessId,
      name: fiscalYearName,
    },
  });

  if (existingFiscalYear) {
    await prisma.fiscal_years.update({
      where: { id: existingFiscalYear.id },
      data: {
        start_date: new Date(`${currentYear}-01-01`),
        end_date: new Date(`${currentYear}-12-31`),
        status: 'OPEN',
      },
    });
  } else {
    await prisma.fiscal_years.create({
      data: {
        id: uuid(),
        business_id: businessId,
        name: fiscalYearName,
        start_date: new Date(`${currentYear}-01-01`),
        end_date: new Date(`${currentYear}-12-31`),
        status: 'OPEN',
      },
    });
  }

  for (const accountData of accountsData) {
    const existingAccount = await prisma.accounts.findFirst({
      where: {
        business_id: businessId,
        code: accountData.code,
      },
    });

    if (!existingAccount) {
      await prisma.accounts.create({
        data: {
          id: uuid(),
          business_id: businessId,
          code: accountData.code,
          name: accountData.name,
          type: accountData.type as any,
        },
      });
    }
  }

  for (const categoryName of categoriesData) {
    const existingCategory = await prisma.categories.findFirst({
      where: {
        business_id: businessId,
        name: categoryName,
      },
    });

    if (!existingCategory) {
      await prisma.categories.create({
        data: {
          business_id: businessId,
          name: categoryName,
        },
      });
    }
  }

  for (const warehouseData of warehousesData) {
    const existingWarehouse = await prisma.warehouses.findFirst({
      where: {
        business_id: businessId,
        name: warehouseData.name,
      },
    });

    if (!existingWarehouse) {
      await prisma.warehouses.create({
        data: {
          id: uuid(),
          business_id: businessId,
          name: warehouseData.name,
          location: warehouseData.location,
        },
      });
    }
  }

  for (const productData of productsData) {
    const existingProduct = await prisma.products.findFirst({
      where: {
        business_id: businessId,
        sku: productData.sku,
      },
    });

    if (!existingProduct) {
      await prisma.products.create({
        data: {
          id: uuid(),
          business_id: businessId,
          name: productData.name,
          sku: productData.sku,
          unit_price: productData.unit_price,
        },
      });
    }
  }

  for (const contactData of contactsData) {
    const existingContact = await prisma.contacts.findFirst({
      where: {
        business_id: businessId,
        name: contactData.name,
      },
    });

    if (!existingContact) {
      await prisma.contacts.create({
        data: {
          id: uuid(),
          business_id: businessId,
          name: contactData.name,
          type: contactData.type as any,
          email: contactData.email,
        },
      });
    }
  }
}

async function seedOperationalData(businessId: string, businessName: string, ownerId: string, managerId: string) {
  const currentYear = new Date().getFullYear();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fiscalYear = await prisma.fiscal_years.findFirst({
    where: {
      business_id: businessId,
      name: currentYear.toString(),
    },
  });

  if (!fiscalYear) {
    throw new Error(`Missing fiscal year for business ${businessName}`);
  }

  const customer = await prisma.contacts.findFirst({
    where: {
      business_id: businessId,
      name: 'Customer A',
      type: 'CUSTOMER' as any,
    },
  });

  const supplier = await prisma.contacts.findFirst({
    where: {
      business_id: businessId,
      name: 'Acme Corp',
      type: 'SUPPLIER' as any,
    },
  });

  const product = await prisma.products.findFirst({
    where: {
      business_id: businessId,
      sku: 'WID-A-001',
    },
  });

  const warehouse = await prisma.warehouses.findFirst({
    where: {
      business_id: businessId,
      name: 'Main Warehouse',
    },
  });

  const receivableAccount = await prisma.accounts.findFirst({
    where: { business_id: businessId, code: '1100' },
  });
  const revenueAccount = await prisma.accounts.findFirst({
    where: { business_id: businessId, code: '4000' },
  });
  const inventoryAccount = await prisma.accounts.findFirst({
    where: { business_id: businessId, code: '1200' },
  });
  const payableAccount = await prisma.accounts.findFirst({
    where: { business_id: businessId, code: '2000' },
  });

  if (!customer || !supplier || !product || !warehouse || !receivableAccount || !revenueAccount || !inventoryAccount || !payableAccount) {
    throw new Error(`Missing base seed data for business ${businessName}`);
  }

  const saleQty = 8;
  const purchaseQty = 12;
  const saleUnitPrice = Number(product.unit_price ?? 0);
  const purchaseUnitCost = Number(product.unit_cost ?? 18.5) || 18.5;
  const saleTotal = Number((saleQty * saleUnitPrice).toFixed(2));
  const purchaseTotal = Number((purchaseQty * purchaseUnitCost).toFixed(2));

  let sale = await prisma.sales.findFirst({
    where: {
      business_id: businessId,
      customer_id: customer.id,
      sale_date: today,
    },
  });

  if (!sale) {
    sale = await prisma.sales.create({
      data: {
        id: uuid(),
        business_id: businessId,
        customer_id: customer.id,
        sale_date: today,
        total: saleTotal,
        paid: 0,
        status: 'PENDING',
      },
    });
  }

  const existingSaleItem = await prisma.sale_items.findFirst({
    where: { sale_id: sale.id },
  });

  if (!existingSaleItem) {
    await prisma.sale_items.create({
      data: {
        id: uuid(),
        sale_id: sale.id,
        product_id: product.id,
        qty: saleQty,
        unit_price: saleUnitPrice,
        total: saleTotal,
      },
    });
  }

  const existingReceivable = await prisma.receivables.findFirst({
    where: { business_id: businessId, reference_id: sale.id },
  });

  if (!existingReceivable) {
    await prisma.receivables.create({
      data: {
        id: uuid(),
        business_id: businessId,
        customer_id: customer.id,
        reference_id: sale.id,
        amount: saleTotal,
        due_date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
      },
    });
  }

  let purchase = await prisma.purchases.findFirst({
    where: {
      business_id: businessId,
      supplier_id: supplier.id,
      purchase_date: today,
    },
  });

  if (!purchase) {
    purchase = await prisma.purchases.create({
      data: {
        id: uuid(),
        business_id: businessId,
        supplier_id: supplier.id,
        purchase_date: today,
        total: purchaseTotal,
        paid: 0,
        status: 'PENDING',
      },
    });
  }

  const existingPurchaseItem = await prisma.purchase_items.findFirst({
    where: { purchase_id: purchase.id },
  });

  if (!existingPurchaseItem) {
    await prisma.purchase_items.create({
      data: {
        id: uuid(),
        purchase_id: purchase.id,
        product_id: product.id,
        qty: purchaseQty,
        unit_cost: purchaseUnitCost,
        total: purchaseTotal,
      },
    });
  }

  const existingPayable = await prisma.payables.findFirst({
    where: { business_id: businessId, reference_id: purchase.id },
  });

  if (!existingPayable) {
    await prisma.payables.create({
      data: {
        id: uuid(),
        business_id: businessId,
        supplier_id: supplier.id,
        reference_id: purchase.id,
        amount: purchaseTotal,
        due_date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
      },
    });
  }

  const saleJournal = await prisma.journal_entries.findFirst({
    where: {
      business_id: businessId,
      reference_type: 'SALE',
      reference_id: sale.id,
    },
  });

  if (!saleJournal) {
    const createdSaleJournal = await prisma.journal_entries.create({
      data: {
        id: uuid(),
        business_id: businessId,
        entry_date: today,
        reference: `SALE-${sale.id.slice(0, 8)}`,
        description: `Sale recorded for ${businessName}`,
        created_by: ownerId,
        reference_type: 'SALE',
        reference_id: sale.id,
        fiscal_year_id: fiscalYear.id,
      },
    });

    await prisma.journal_lines.create({
      data: {
        id: uuid(),
        journal_id: createdSaleJournal.id,
        account_id: receivableAccount.id,
        debit: saleTotal,
        credit: 0,
      },
    });

    await prisma.journal_lines.create({
      data: {
        id: uuid(),
        journal_id: createdSaleJournal.id,
        account_id: revenueAccount.id,
        debit: 0,
        credit: saleTotal,
      },
    });
  }

  const purchaseJournal = await prisma.journal_entries.findFirst({
    where: {
      business_id: businessId,
      reference_type: 'PURCHASE',
      reference_id: purchase.id,
    },
  });

  if (!purchaseJournal) {
    const createdPurchaseJournal = await prisma.journal_entries.create({
      data: {
        id: uuid(),
        business_id: businessId,
        entry_date: today,
        reference: `PUR-${purchase.id.slice(0, 8)}`,
        description: `Purchase recorded for ${businessName}`,
        created_by: managerId,
        reference_type: 'PURCHASE',
        reference_id: purchase.id,
        fiscal_year_id: fiscalYear.id,
      },
    });

    await prisma.journal_lines.create({
      data: {
        id: uuid(),
        journal_id: createdPurchaseJournal.id,
        account_id: inventoryAccount.id,
        debit: purchaseTotal,
        credit: 0,
      },
    });

    await prisma.journal_lines.create({
      data: {
        id: uuid(),
        journal_id: createdPurchaseJournal.id,
        account_id: payableAccount.id,
        debit: 0,
        credit: purchaseTotal,
      },
    });
  }

  const saleMovement = await prisma.stock_movements.findFirst({
    where: {
      business_id: businessId,
      reference_type: 'SALE',
      reference_id: sale.id,
    },
  });

  if (!saleMovement) {
    await prisma.stock_movements.create({
      data: {
        id: uuid(),
        business_id: businessId,
        product_id: product.id,
        warehouse_id: warehouse.id,
        type: 'OUT',
        reference_type: 'SALE',
        reference_id: sale.id,
        quantity: saleQty,
        unit_cost: purchaseUnitCost,
        movement_date: today,
      },
    });
  }

  const purchaseMovement = await prisma.stock_movements.findFirst({
    where: {
      business_id: businessId,
      reference_type: 'PURCHASE',
      reference_id: purchase.id,
    },
  });

  if (!purchaseMovement) {
    await prisma.stock_movements.create({
      data: {
        id: uuid(),
        business_id: businessId,
        product_id: product.id,
        warehouse_id: warehouse.id,
        type: 'IN',
        reference_type: 'PURCHASE',
        reference_id: purchase.id,
        quantity: purchaseQty,
        unit_cost: purchaseUnitCost,
        movement_date: today,
      },
    });
  }

  const reportDefinitions = [
    {
      type: 'BALANCE_SHEET' as const,
      name: `${businessName} Balance Sheet`,
      data: {
        cash: 5000,
        inventory: purchaseTotal,
        receivables: saleTotal,
        payables: purchaseTotal,
      },
    },
    {
      type: 'INCOME_STATEMENT' as const,
      name: `${businessName} Income Statement`,
      data: {
        revenue: saleTotal,
        cogs: purchaseTotal,
        gross_profit: saleTotal - purchaseTotal,
      },
    },
    {
      type: 'TRIAL_BALANCE' as const,
      name: `${businessName} Trial Balance`,
      data: {
        debits: saleTotal + purchaseTotal,
        credits: saleTotal + purchaseTotal,
      },
    },
    {
      type: 'LEDGER' as const,
      name: `${businessName} General Ledger`,
      data: {
        entries: 2,
      },
    },
    {
      type: 'CASHBOOK' as const,
      name: `${businessName} Cashbook`,
      data: {
        opening_balance: 0,
        closing_balance: 5000 - purchaseTotal + saleTotal,
      },
    },
  ];

  for (const reportDefinition of reportDefinitions) {
    const existingReport = await prisma.reports.findFirst({
      where: {
        business_id: businessId,
        type: reportDefinition.type,
      },
    });

    if (!existingReport) {
      await prisma.reports.create({
        data: {
          id: uuid(),
          business_id: businessId,
          name: reportDefinition.name,
          type: reportDefinition.type,
          period_start: new Date(`${currentYear}-01-01`),
          period_end: new Date(`${currentYear}-12-31`),
          data: JSON.stringify(reportDefinition.data),
          status: 'GENERATED',
          format: 'JSON',
        },
      });
    }
  }

  const notificationTitle = 'Reports generated';
  const existingNotification = await prisma.notifications.findFirst({
    where: {
      business_id: businessId,
      title: notificationTitle,
    },
  });

  if (!existingNotification) {
    await prisma.notifications.create({
      data: {
        id: uuid(),
        business_id: businessId,
        user_id: ownerId,
        title: notificationTitle,
        message: `Operational and report data generated for ${businessName}.`,
        type: 'REPORT_READY',
      },
    });
  }
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  const usersByEmail = new Map<string, { id: string; first_name: string; last_name: string; email: string }>();

  for (const user of seededUsers) {
    const savedUser = await upsertUser(user);
    usersByEmail.set(savedUser.email, savedUser);
  }

  let seededBusinessCount = 0;

  for (const business of seededBusinesses) {
    const savedBusiness = await upsertBusiness(business);

    const owner = usersByEmail.get(business.ownerEmail);
    const manager = usersByEmail.get(business.managerEmail);

    if (!owner) {
      throw new Error(`Missing owner user for ${business.name}: ${business.ownerEmail}`);
    }

    if (!manager) {
      throw new Error(`Missing manager user for ${business.name}: ${business.managerEmail}`);
    }

    await upsertBusinessUser(savedBusiness.id, owner.id, 'OWNER');
    await upsertBusinessUser(savedBusiness.id, manager.id, 'MANAGER');
    await seedBusinessData(savedBusiness.id);
    await seedOperationalData(savedBusiness.id, savedBusiness.name, owner.id, manager.id);

    console.log(`✓ Seeded ${savedBusiness.name} with owner ${owner.email} and manager ${manager.email}`);
    seededBusinessCount++;
  }

  console.log('\n✅ Database seed completed successfully!\n');
  console.log('📋 Admin Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Email:    admin@accplan.com');
  console.log('  Password: Admin@12345');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔗 To login, POST to /auth/login:');
  console.log('{ "email": "admin@accplan.com", "password": "Admin@12345" }\n');
  console.log(`👥 Seeded ${seededUsers.length} users and ${seededBusinessCount} businesses.`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
