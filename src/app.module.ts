import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './business/business.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ContactsModule } from './contacts/contacts.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { SalesModule } from './sales/sales.module';
import { SaleItemsModule } from './sale-items/sale-items.module';
import { PurchasesModule } from './purchases/purchases.module';
import { PurchaseItemsModule } from './purchase-items/purchase-items.module';
import { AccountsModule } from './accounts/accounts.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { JournalLinesModule } from './journal-lines/journal-lines.module';
import { FiscalYearsModule } from './fiscal-years/fiscal-years.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReceivablesModule } from './receivables/receivables.module';
import { PayablesModule } from './payables/payables.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { BusinessUsersModule } from './business-users/business-users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    BusinessModule,
    ProductsModule,
    CategoriesModule,
    ContactsModule,
    WarehousesModule,
    SalesModule,
    SaleItemsModule,
    PurchasesModule,
    PurchaseItemsModule,
    AccountsModule,
    JournalEntriesModule,
    JournalLinesModule,
    FiscalYearsModule,
    ReportsModule,
    NotificationsModule,
    ReceivablesModule,
    PayablesModule,
    StockMovementsModule,
    BusinessUsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
