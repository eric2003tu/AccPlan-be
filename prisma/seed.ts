import { PrismaClient, business_users_role, reports_type } from '@prisma/client';
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
  { first_name: 'Owner', last_name: 'User', email: 'owner@accplan.com', password: 'Owner@12345' },
  { first_name: 'Manager', last_name: 'One', email: 'manager1@accplan.com', password: 'Manager@12345' },
  { first_name: 'Manager', last_name: 'Two', email: 'manager2@accplan.com', password: 'Manager@12345' },
  { first_name: 'Manager', last_name: 'Three', email: 'manager3@accplan.com', password: 'Manager@12345' },
  { first_name: 'Normal', last_name: 'User', email: 'normal@accplan.com', password: 'Normal@12345' },
];

const seededBusinesses: SeedBusiness[] = [
  {
    name: 'Alpha Ventures Ltd',
    legal_name: 'Alpha Ventures Limited',
    tax_id: 'TAX-ALP-0001',
    country: 'Rwanda',
    city: 'Kigali',
    ownerEmail: 'owner@accplan.com',
    managerEmail: 'manager1@accplan.com',
  },
  {
    name: 'Beta Trading Ltd',
    legal_name: 'Beta Trading Limited',
    tax_id: 'TAX-BET-0002',
    country: 'Rwanda',
    city: 'Kigali',
    ownerEmail: 'owner@accplan.com',
    managerEmail: 'manager2@accplan.com',
  },
  {
    name: 'Gamma Supplies Ltd',
    legal_name: 'Gamma Supplies Limited',
    tax_id: 'TAX-GAM-0003',
    country: 'Rwanda',
    city: 'Kigali',
    ownerEmail: 'owner@accplan.com',
    managerEmail: 'manager3@accplan.com',
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

type ReportBlueprint = {
  type: reports_type;
  name: string;
  data: Record<string, unknown>;
};

function formatMoney(value: number) {
  const isWholeNumber = Number.isInteger(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: isWholeNumber ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function splitAmount(total: number, ratios: number[]) {
  const parts = ratios.slice(0, -1).map((ratio) => Math.round(total * ratio));
  const consumed = parts.reduce((sum, value) => sum + value, 0);
  return [...parts, total - consumed];
}

function buildReportBlueprints(businessName: string, businessId: string, currentYear: number, variant: number, saleTotal: number, purchaseTotal: number): ReportBlueprint[] {
  const periodStart = new Date(`${currentYear}-01-01`);
  const periodEnd = new Date(`${currentYear}-12-31`);
  const asOf = new Date(`${currentYear}-04-${String(10 + variant).padStart(2, '0')}`);

  const balanceSheetCurrentAssetsTotal = 91500 + (variant - 1) * 8200;
  const balanceSheetFixedAssetsTotal = 92500 + (variant - 1) * 9400;
  const balanceSheetCurrentLiabilitiesTotal = 21500 + (variant - 1) * 3150;
  const balanceSheetLongTermLiabilitiesTotal = 51000 + (variant - 1) * 2750;
  const balanceSheetCapitalTotal = 120000 + (variant - 1) * 10000;
  const balanceSheetRetainedEarnings = -8500 + (variant - 1) * 4250;
  const balanceSheetTotalAssets = balanceSheetCurrentAssetsTotal + balanceSheetFixedAssetsTotal;
  const balanceSheetTotalLiabilities = balanceSheetCurrentLiabilitiesTotal + balanceSheetLongTermLiabilitiesTotal;
  const balanceSheetTotalEquity = balanceSheetCapitalTotal + balanceSheetRetainedEarnings;

  const currentAssetParts = splitAmount(balanceSheetCurrentAssetsTotal, [0.46, 0.34, 0.2]);
  const fixedAssetParts = splitAmount(balanceSheetFixedAssetsTotal, [0.72, 0.28]);
  const currentLiabilityParts = splitAmount(balanceSheetCurrentLiabilitiesTotal, [0.82, 0.18]);
  const longTermLiabilityParts = splitAmount(balanceSheetLongTermLiabilitiesTotal, [1]);
  const capitalParts = splitAmount(balanceSheetCapitalTotal, [1]);

  const revenuePrimary = saleTotal + 39000 + (variant - 1) * 5200;
  const revenueSecondary = 40450 + (variant - 1) * 4780;
  const costOfSalesPrimary = purchaseTotal + 8000 + (variant - 1) * 3000;
  const costOfSalesSecondary = 11500 + (variant - 1) * 2300;
  const operatingExpenseLines = [18000 + (variant - 1) * 1400, 8000 + (variant - 1) * 600, 3500 + (variant - 1) * 450, 4320 + (variant - 1) * 780, 6000 + (variant - 1) * 500];
  const revenueTotal = revenuePrimary + revenueSecondary;
  const costOfSalesTotal = costOfSalesPrimary + costOfSalesSecondary;
  const operatingExpensesTotal = operatingExpenseLines.reduce((sum, value) => sum + value, 0);
  const grossProfit = revenueTotal - costOfSalesTotal;
  const netProfit = grossProfit - operatingExpensesTotal;

  const openingBalance = 18750 + (variant - 1) * 9800;
  const receiptAmounts = [18000 + (variant - 1) * 2000, 10000 + (variant - 1) * 1300, 14800 + (variant - 1) * 1500];
  const paymentAmounts = [8200 + (variant - 1) * 1300, 2750 + (variant - 1) * 450, 18010 + (variant - 1) * 2000];
  const receipts: Array<{ date: string; reference: string; particulars: string; amount: string; balance: string }> = [];
  const payments: Array<{ date: string; reference: string; particulars: string; amount: string; balance: string }> = [];

  let runningCash = openingBalance;
  receiptAmounts.forEach((amount, index) => {
    runningCash += amount;
    receipts.push({
      date: asOf.toISOString().slice(0, 10),
      reference: `CB-${variant}0${index + 1}`,
      particulars: index === 0 ? 'Cash sales' : index === 1 ? 'Service income received' : 'Bank deposit reversal',
      amount: formatMoney(amount),
      balance: formatMoney(runningCash),
    });
  });

  runningCash = openingBalance;
  paymentAmounts.forEach((amount, index) => {
    runningCash -= amount;
    payments.push({
      date: asOf.toISOString().slice(0, 10),
      reference: `CB-${variant}1${index + 1}`,
      particulars: index === 0 ? 'Supplier payment' : index === 1 ? 'Fuel and transport' : 'Payroll settlement',
      amount: formatMoney(amount),
      balance: formatMoney(runningCash),
    });
  });

  const trialBalanceAccounts = [
    { account: 'Cash', debit: 42000 + (variant - 1) * 10000 },
    { account: 'Accounts receivable', debit: 31500 + (variant - 1) * 3000 },
    { account: 'Inventory', debit: 18000 + (variant - 1) * 3000 },
    { account: 'Equipment', debit: 92500 + (variant - 1) * 10000 },
    { account: 'Prepaid expenses', debit: 61000 + (variant - 1) * 7000 },
    { account: 'Accounts payable', credit: 17500 + (variant - 1) * 3500 },
    { account: 'Bank loan', credit: 55000 + (variant - 1) * 5000 },
    { account: 'Owner equity', credit: 172500 + (variant - 1) * 24500 },
  ];
  const trialDebitTotal = trialBalanceAccounts.reduce((sum, line) => sum + (line.debit ?? 0), 0);
  const trialCreditTotal = trialBalanceAccounts.reduce((sum, line) => sum + (line.credit ?? 0), 0);

  const ledgerRows = [
    {
      date: asOf.toISOString().slice(0, 10),
      reference: `LG-${variant}01`,
      description: 'Sales invoice posted and revenue recognized',
      debit: formatMoney(revenuePrimary),
      credit: formatMoney(revenuePrimary),
      balance: formatMoney(revenuePrimary),
    },
    {
      date: asOf.toISOString().slice(0, 10),
      reference: `LG-${variant}02`,
      description: 'Supplier purchase recorded',
      debit: formatMoney(costOfSalesPrimary),
      credit: formatMoney(costOfSalesPrimary),
      balance: formatMoney(revenuePrimary + costOfSalesPrimary),
    },
    {
      date: asOf.toISOString().slice(0, 10),
      reference: `LG-${variant}03`,
      description: 'Monthly operating expense paid',
      debit: formatMoney(operatingExpenseLines[0]),
      credit: formatMoney(operatingExpenseLines[0]),
      balance: formatMoney(revenuePrimary + costOfSalesPrimary + operatingExpenseLines[0]),
    },
    {
      date: asOf.toISOString().slice(0, 10),
      reference: `LG-${variant}04`,
      description: 'Business loan received from bank',
      debit: formatMoney(balanceSheetLongTermLiabilitiesTotal),
      credit: formatMoney(balanceSheetLongTermLiabilitiesTotal),
      balance: formatMoney(revenuePrimary + costOfSalesPrimary + operatingExpenseLines[0] + balanceSheetLongTermLiabilitiesTotal),
    },
    {
      date: asOf.toISOString().slice(0, 10),
      reference: `LG-${variant}05`,
      description: 'Service revenue recognized',
      debit: formatMoney(revenueSecondary),
      credit: formatMoney(revenueSecondary),
      balance: formatMoney(revenuePrimary + costOfSalesPrimary + operatingExpenseLines[0] + balanceSheetLongTermLiabilitiesTotal + revenueSecondary),
    },
  ];

  return [
    {
      type: 'BALANCE_SHEET',
      name: `${businessName} Balance Sheet`,
      data: {
        business_id: businessId,
        business_name: businessName,
        as_of: asOf.toISOString(),
        currentAssets: [
          { label: 'Cash and bank balances', amount: formatMoney(currentAssetParts[0]) },
          { label: 'Accounts receivable', amount: formatMoney(currentAssetParts[1]) },
          { label: 'Inventory', amount: formatMoney(currentAssetParts[2]) },
        ],
        fixedAssets: [
          { label: 'Plant and equipment', amount: formatMoney(fixedAssetParts[0]) },
          { label: 'Furniture and fittings', amount: formatMoney(fixedAssetParts[1]) },
        ],
        currentLiabilities: [
          { label: 'Accounts payable', amount: formatMoney(currentLiabilityParts[0]) },
          { label: 'Accrued expenses', amount: formatMoney(currentLiabilityParts[1]) },
        ],
        longTermLiabilities: [{ label: 'Bank term loan', amount: formatMoney(longTermLiabilityParts[0]) }],
        capital: [{ label: 'Owner capital', amount: formatMoney(capitalParts[0]) }],
        totals: {
          currentAssets: formatMoney(balanceSheetCurrentAssetsTotal),
          fixedAssets: formatMoney(balanceSheetFixedAssetsTotal),
          totalAssets: formatMoney(balanceSheetTotalAssets),
          currentLiabilities: formatMoney(balanceSheetCurrentLiabilitiesTotal),
          longTermLiabilities: formatMoney(balanceSheetLongTermLiabilitiesTotal),
          totalLiabilities: formatMoney(balanceSheetTotalLiabilities),
          capital: formatMoney(balanceSheetCapitalTotal),
          retainedEarnings: formatMoney(balanceSheetRetainedEarnings),
          totalEquity: formatMoney(balanceSheetTotalEquity),
          liabilitiesAndEquity: formatMoney(balanceSheetTotalLiabilities + balanceSheetTotalEquity),
          balanceCheck: balanceSheetTotalAssets === balanceSheetTotalLiabilities + balanceSheetTotalEquity ? 'Balanced' : 'Out of balance',
        },
      },
    },
    {
      type: 'INCOME_STATEMENT',
      name: `${businessName} Income Statement`,
      data: {
        business_id: businessId,
        business_name: businessName,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        revenue: [
          { label: 'Sales revenue', amount: formatMoney(revenuePrimary) },
          { label: 'Service income', amount: formatMoney(revenueSecondary) },
        ],
        costOfSales: [
          { label: 'Cost of goods sold', amount: formatMoney(costOfSalesPrimary) },
          { label: 'Direct labour', amount: formatMoney(costOfSalesSecondary) },
        ],
        operatingExpenses: [
          { label: 'Salaries and wages', amount: formatMoney(operatingExpenseLines[0]) },
          { label: 'Rent expense', amount: formatMoney(operatingExpenseLines[1]) },
          { label: 'Utilities', amount: formatMoney(operatingExpenseLines[2]) },
          { label: 'Marketing', amount: formatMoney(operatingExpenseLines[3]) },
          { label: 'Administrative expenses', amount: formatMoney(operatingExpenseLines[4]) },
        ],
        totals: {
          revenue: formatMoney(revenueTotal),
          costOfSales: formatMoney(costOfSalesTotal),
          grossProfit: formatMoney(grossProfit),
          operatingExpenses: formatMoney(operatingExpensesTotal),
          netProfit: formatMoney(netProfit),
        },
      },
    },
    {
      type: 'TRIAL_BALANCE',
      name: `${businessName} Trial Balance`,
      data: {
        business_id: businessId,
        business_name: businessName,
        as_of: asOf.toISOString(),
        accounts: trialBalanceAccounts.map((line) => ({
          account: line.account,
          debit: line.debit ? formatMoney(line.debit) : undefined,
          credit: line.credit ? formatMoney(line.credit) : undefined,
        })),
        totals: {
          debit: formatMoney(trialDebitTotal),
          credit: formatMoney(trialCreditTotal),
          difference: formatMoney(Math.abs(trialDebitTotal - trialCreditTotal)),
        },
      },
    },
    {
      type: 'LEDGER',
      name: `${businessName} General Ledger`,
      data: {
        business_id: businessId,
        business_name: businessName,
        as_of: asOf.toISOString(),
        rows: ledgerRows,
        sections: [
          {
            title: 'Ledger Summary',
            description: 'A compact overview of the sample ledger movement.',
            items: [
              { label: 'Entries', value: String(ledgerRows.length) },
              { label: 'Balanced', value: 'Yes' },
            ],
          },
          {
            title: 'Control Totals',
            description: 'Illustrative totals that mirror the frontend ledger panel.',
            items: [
              { label: 'Revenue movements', value: formatMoney(revenuePrimary + revenueSecondary) },
              { label: 'Expense movements', value: formatMoney(costOfSalesPrimary + costOfSalesSecondary + operatingExpensesTotal) },
            ],
          },
        ],
      },
    },
    {
      type: 'CASHBOOK',
      name: `${businessName} Cashbook`,
      data: {
        business_id: businessId,
        business_name: businessName,
        as_of: asOf.toISOString(),
        openingBalance: formatMoney(openingBalance),
        receipts,
        payments,
        totals: {
          receipts: formatMoney(receiptAmounts.reduce((sum, amount) => sum + amount, 0)),
          payments: formatMoney(paymentAmounts.reduce((sum, amount) => sum + amount, 0)),
          closing: formatMoney(openingBalance + receiptAmounts.reduce((sum, amount) => sum + amount, 0) - paymentAmounts.reduce((sum, amount) => sum + amount, 0)),
        },
      },
    },
  ];
}

async function upsertUser(user: SeedUser) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const existingUser = await prisma.users.findUnique({ where: { email: user.email } });

  // Determine if this seeded user is listed as an owner or manager for any seeded business
  const isOwner = seededBusinesses.some((b) => b.ownerEmail === user.email);
  const isManager = seededBusinesses.some((b) => b.managerEmail === user.email);

  if (existingUser) {
    const intendedRole = user.email === 'admin@accplan.com' ? 'ADMIN' : isOwner ? 'OWNER' : isManager ? 'MANAGER' : existingUser.system_role ?? 'NORMAL';

    return prisma.users.update({
      where: { email: user.email },
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        password: hashedPassword,
        system_role: intendedRole,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        system_role: true,
      },
    });
  }

  const roleForCreate = user.email === 'admin@accplan.com' ? 'ADMIN' : isOwner ? 'OWNER' : isManager ? 'MANAGER' : 'NORMAL';

  return prisma.users.create({
    data: {
      id: uuid(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: hashedPassword,
      system_role: roleForCreate,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      system_role: true,
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

async function seedOperationalData(businessId: string, businessName: string, ownerId: string, managerId: string, reportVariant?: number) {
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

  if (reportVariant) {
    const reportDefinitions = buildReportBlueprints(businessName, businessId, currentYear, reportVariant, saleTotal, purchaseTotal);

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
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  await prisma.reports.deleteMany({});
  await prisma.notifications.deleteMany({
    where: {
      title: 'Reports generated',
    },
  });

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
    await seedOperationalData(savedBusiness.id, savedBusiness.name, owner.id, manager.id, seededBusinessCount < 3 ? seededBusinessCount + 1 : undefined);

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
