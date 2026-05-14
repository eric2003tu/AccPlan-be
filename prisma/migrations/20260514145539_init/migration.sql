-- CreateEnum
CREATE TYPE "business_users_role" AS ENUM ('OWNER', 'ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "contacts_type" AS ENUM ('CUSTOMER', 'SUPPLIER', 'LENDER');

-- CreateEnum
CREATE TYPE "reports_type" AS ENUM ('BALANCE_SHEET', 'INCOME_STATEMENT', 'TRIAL_BALANCE', 'LEDGER', 'CASHBOOK');

-- CreateEnum
CREATE TYPE "accounts_type" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "stock_movements_type" AS ENUM ('IN', 'OUT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "fiscal_years_status" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "notifications_type" AS ENUM ('REPORT_READY', 'SYSTEM_ALERT', 'WARNING', 'INFO');

-- CreateEnum
CREATE TYPE "stock_movements_reference_type" AS ENUM ('SALE', 'PURCHASE', 'RETURN', 'MANUAL');

-- CreateEnum
CREATE TYPE "payables_status" AS ENUM ('OPEN', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "purchases_status" AS ENUM ('PENDING', 'PAID', 'PARTIAL');

-- CreateEnum
CREATE TYPE "receivables_status" AS ENUM ('OPEN', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "sales_status" AS ENUM ('PENDING', 'PAID', 'PARTIAL');

-- CreateEnum
CREATE TYPE "journal_entries_reference_type" AS ENUM ('SALE', 'PURCHASE', 'EXPENSE', 'INCOME', 'LOAN', 'STOCK', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "accounts" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "code" VARCHAR(20),
    "name" VARCHAR(255) NOT NULL,
    "type" "accounts_type" NOT NULL,
    "parent_id" CHAR(36),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_users" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "role" "business_users_role" NOT NULL,

    CONSTRAINT "business_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" CHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "legal_name" VARCHAR(255),
    "tax_id" VARCHAR(100),
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "business_id" CHAR(36),
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "contacts_type" NOT NULL,
    "phone" VARCHAR(50),
    "email" VARCHAR(150),

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiscal_years" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "name" VARCHAR(50),
    "start_date" DATE,
    "end_date" DATE,
    "status" "fiscal_years_status" DEFAULT 'OPEN',

    CONSTRAINT "fiscal_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "entry_date" DATE,
    "reference" VARCHAR(100),
    "description" TEXT,
    "created_by" CHAR(36),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "reference_type" "journal_entries_reference_type",
    "reference_id" CHAR(36),
    "fiscal_year_id" CHAR(36),

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_lines" (
    "id" CHAR(36) NOT NULL,
    "journal_id" CHAR(36) NOT NULL,
    "account_id" CHAR(36),
    "debit" DECIMAL(12,2) DEFAULT 0.00,
    "credit" DECIMAL(12,2) DEFAULT 0.00,

    CONSTRAINT "journal_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_repayments" (
    "id" CHAR(36) NOT NULL,
    "loan_id" CHAR(36),
    "amount" DECIMAL(12,2),
    "payment_date" DATE,

    CONSTRAINT "loan_repayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "user_id" CHAR(36),
    "title" VARCHAR(255),
    "message" TEXT,
    "type" "notifications_type",
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payables" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36),
    "supplier_id" CHAR(36),
    "reference_id" CHAR(36),
    "amount" DECIMAL(12,2),
    "due_date" DATE,
    "status" "payables_status",

    CONSTRAINT "payables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(100),
    "barcode" VARCHAR(100),
    "unit_cost" DECIMAL(12,2) DEFAULT 0.00,
    "unit_price" DECIMAL(12,2) DEFAULT 0.00,
    "reorder_level" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "category_id" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_items" (
    "id" CHAR(36) NOT NULL,
    "purchase_id" CHAR(36) NOT NULL,
    "product_id" CHAR(36),
    "qty" INTEGER NOT NULL,
    "unit_cost" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "purchase_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "supplier_id" CHAR(36),
    "purchase_date" DATE,
    "total" DECIMAL(12,2) DEFAULT 0.00,
    "paid" DECIMAL(12,2) DEFAULT 0.00,
    "status" "purchases_status" DEFAULT 'PENDING',

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receivables" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36),
    "customer_id" CHAR(36),
    "reference_id" CHAR(36),
    "amount" DECIMAL(12,2),
    "due_date" DATE,
    "status" "receivables_status",

    CONSTRAINT "receivables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "name" VARCHAR(100),
    "type" "reports_type",
    "period_start" DATE,
    "period_end" DATE,
    "data" TEXT,
    "file_url" VARCHAR(255),
    "status" VARCHAR(50) DEFAULT 'GENERATED',
    "format" VARCHAR(20) DEFAULT 'JSON',
    "generated_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_items" (
    "id" CHAR(36) NOT NULL,
    "sale_id" CHAR(36) NOT NULL,
    "product_id" CHAR(36),
    "qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "customer_id" CHAR(36),
    "sale_date" DATE,
    "total" DECIMAL(12,2) DEFAULT 0.00,
    "paid" DECIMAL(12,2) DEFAULT 0.00,
    "status" "sales_status" DEFAULT 'PENDING',

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "product_id" CHAR(36),
    "warehouse_id" CHAR(36),
    "type" "stock_movements_type" NOT NULL,
    "reference_type" "stock_movements_reference_type",
    "reference_id" CHAR(36),
    "quantity" INTEGER NOT NULL,
    "unit_cost" DECIMAL(12,2),
    "movement_date" DATE,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" CHAR(36) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" CHAR(36) NOT NULL,
    "business_id" CHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "location" VARCHAR(255),

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_accounts_business_id" ON "accounts"("business_id");

-- CreateIndex
CREATE INDEX "idx_business_users_user" ON "business_users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_id_user_id_unique" ON "business_users"("business_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_categories_business_id" ON "categories"("business_id");

-- CreateIndex
CREATE INDEX "idx_contacts_business_id" ON "contacts"("business_id");

-- CreateIndex
CREATE INDEX "idx_fiscal_years_business_id" ON "fiscal_years"("business_id");

-- CreateIndex
CREATE INDEX "idx_journal_business" ON "journal_entries"("business_id");

-- CreateIndex
CREATE INDEX "idx_journal_date" ON "journal_entries"("entry_date");

-- CreateIndex
CREATE INDEX "idx_journal_reference" ON "journal_entries"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "idx_journal_lines_account" ON "journal_lines"("account_id");

-- CreateIndex
CREATE INDEX "idx_journal_lines_journal" ON "journal_lines"("journal_id");

-- CreateIndex
CREATE INDEX "idx_notifications_business_id" ON "notifications"("business_id");

-- CreateIndex
CREATE INDEX "idx_payables_business" ON "payables"("business_id");

-- CreateIndex
CREATE INDEX "idx_products_business" ON "products"("business_id");

-- CreateIndex
CREATE INDEX "idx_products_category" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "idx_purchase_items_purchase" ON "purchase_items"("purchase_id");

-- CreateIndex
CREATE INDEX "idx_purchases_business" ON "purchases"("business_id");

-- CreateIndex
CREATE INDEX "idx_receivables_business" ON "receivables"("business_id");

-- CreateIndex
CREATE INDEX "idx_reports_business_id" ON "reports"("business_id");

-- CreateIndex
CREATE INDEX "idx_sale_items_sale" ON "sale_items"("sale_id");

-- CreateIndex
CREATE INDEX "idx_sales_business" ON "sales"("business_id");

-- CreateIndex
CREATE INDEX "idx_stock_business" ON "stock_movements"("business_id");

-- CreateIndex
CREATE INDEX "idx_stock_product" ON "stock_movements"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "users"("email");

-- CreateIndex
CREATE INDEX "business_id" ON "warehouses"("business_id");

-- AddForeignKey
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
