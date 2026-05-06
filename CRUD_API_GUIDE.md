# Accounting & Planning Backend API

A comprehensive NestJS-based ERP backend for managing accounting, inventory, sales, purchases, and business operations.

## Features

Complete CRUD operations with Swagger documentation for:

### Core Modules
- **Users**: User management and authentication
- **Business**: Business entity management
- **Business Users**: Role-based user assignment to businesses

### Inventory & Products
- **Products**: Product catalog management
- **Categories**: Product categorization
- **Warehouses**: Warehouse/inventory locations
- **Stock Movements**: Track inventory movements (IN, OUT, ADJUSTMENTS)

### Sales & Purchases
- **Sales**: Sales orders and transactions
- **Sale Items**: Individual items within sales orders
- **Purchases**: Purchase orders
- **Purchase Items**: Individual items within purchase orders

### Contacts
- **Contacts**: Customers, suppliers, and lenders management

### Accounting
- **Accounts**: Chart of accounts with hierarchical structure
- **Journal Entries**: Double-entry bookkeeping
- **Journal Lines**: Individual debit/credit lines
- **Fiscal Years**: Accounting period management
- **Reports**: Financial reports generation

### Receivables & Payables
- **Receivables**: Track customer outstanding amounts
- **Payables**: Track supplier outstanding amounts

### Notifications
- **Notifications**: System notifications for reports and alerts

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Set up your environment variables in `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/accplan"
PORT=3000
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run start:dev
```

## API Documentation

Once the server is running, visit:
```
http://localhost:3000/api/docs
```

This opens the interactive Swagger UI where you can:
- View all available endpoints
- See request/response schemas
- Test API calls directly
- Download API specification

## Available Endpoints

### Users
- `POST /users` - Create user
- `GET /users` - List all users (pagination)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Business
- `POST /business` - Create business
- `GET /business` - List all businesses
- `GET /business/:id` - Get business by ID
- `PUT /business/:id` - Update business
- `DELETE /business/:id` - Delete business

### Products
- `POST /products` - Create product
- `GET /products` - List products (with businessId filter)
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Categories
- `POST /categories` - Create category
- `GET /categories` - List categories
- `GET /categories/:id` - Get category by ID
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Contacts
- `POST /contacts` - Create contact
- `GET /contacts` - List contacts (with type filtering)
- `GET /contacts/:id` - Get contact by ID
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

### Warehouses
- `POST /warehouses` - Create warehouse
- `GET /warehouses` - List warehouses
- `GET /warehouses/:id` - Get warehouse by ID
- `PUT /warehouses/:id` - Update warehouse
- `DELETE /warehouses/:id` - Delete warehouse

### Sales
- `POST /sales` - Create sale
- `GET /sales` - List sales (with businessId filter)
- `GET /sales/:id` - Get sale with items
- `PUT /sales/:id` - Update sale
- `DELETE /sales/:id` - Delete sale

### Sale Items
- `POST /sale-items` - Add item to sale
- `GET /sale-items` - List sale items (with saleId filter)
- `GET /sale-items/:id` - Get sale item
- `PUT /sale-items/:id` - Update sale item
- `DELETE /sale-items/:id` - Remove item

### Purchases
- `POST /purchases` - Create purchase
- `GET /purchases` - List purchases (with businessId filter)
- `GET /purchases/:id` - Get purchase with items
- `PUT /purchases/:id` - Update purchase
- `DELETE /purchases/:id` - Delete purchase

### Purchase Items
- `POST /purchase-items` - Add item to purchase
- `GET /purchase-items` - List purchase items
- `GET /purchase-items/:id` - Get purchase item
- `PUT /purchase-items/:id` - Update purchase item
- `DELETE /purchase-items/:id` - Remove item

### Accounts
- `POST /accounts` - Create account
- `GET /accounts` - List accounts (with businessId filter)
- `GET /accounts/:id` - Get account
- `PUT /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account

### Journal Entries
- `POST /journal-entries` - Create journal entry
- `GET /journal-entries` - List entries (with businessId filter)
- `GET /journal-entries/:id` - Get entry with lines
- `PUT /journal-entries/:id` - Update entry
- `DELETE /journal-entries/:id` - Delete entry

### Journal Lines
- `POST /journal-lines` - Add line to entry
- `GET /journal-lines` - List lines (with journalId filter)
- `GET /journal-lines/:id` - Get line
- `PUT /journal-lines/:id` - Update line
- `DELETE /journal-lines/:id` - Remove line

### Fiscal Years
- `POST /fiscal-years` - Create fiscal year
- `GET /fiscal-years` - List fiscal years
- `GET /fiscal-years/:id` - Get fiscal year
- `PUT /fiscal-years/:id` - Update fiscal year
- `DELETE /fiscal-years/:id` - Delete fiscal year

### Reports
- `POST /reports` - Generate report
- `GET /reports` - List reports (with businessId filter)
- `GET /reports/:id` - Get report
- `PUT /reports/:id` - Update report
- `DELETE /reports/:id` - Delete report

### Notifications
- `POST /notifications` - Create notification
- `GET /notifications` - List notifications
- `GET /notifications/:id` - Get notification
- `PUT /notifications/:id` - Update notification
- `DELETE /notifications/:id` - Delete notification

### Receivables
- `POST /receivables` - Create receivable
- `GET /receivables` - List receivables
- `GET /receivables/:id` - Get receivable
- `PUT /receivables/:id` - Update receivable
- `DELETE /receivables/:id` - Delete receivable

### Payables
- `POST /payables` - Create payable
- `GET /payables` - List payables
- `GET /payables/:id` - Get payable
- `PUT /payables/:id` - Update payable
- `DELETE /payables/:id` - Delete payable

### Stock Movements
- `POST /stock-movements` - Record movement
- `GET /stock-movements` - List movements
- `GET /stock-movements/:id` - Get movement
- `PUT /stock-movements/:id` - Update movement
- `DELETE /stock-movements/:id` - Delete movement

### Business Users
- `POST /business-users` - Assign user to business
- `GET /business-users` - List assignments
- `GET /business-users/:id` - Get assignment
- `PUT /business-users/:id` - Update role
- `DELETE /business-users/:id` - Remove user from business

## Database Schema

All models are defined in `prisma/schema.prisma` with relationships for:
- Multi-tenancy (business isolation)
- Double-entry accounting
- Inventory tracking
- Sales and purchase management
- Financial reporting

## Development

### Running Tests
```bash
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

### Build for Production
```bash
npm run build
npm run start:prod
```

## Architecture

### Project Structure
```
src/
├── prisma/           # Database service and module
├── users/            # User management
├── business/         # Business entity management
├── products/         # Product catalog
├── categories/       # Product categories
├── contacts/         # Customer/Supplier contacts
├── warehouses/       # Inventory locations
├── sales/            # Sales management
├── sale-items/       # Sales line items
├── purchases/        # Purchase management
├── purchase-items/   # Purchase line items
├── accounts/         # Chart of accounts
├── journal-entries/  # Journal entries
├── journal-lines/    # Journal line items
├── fiscal-years/     # Fiscal period management
├── reports/          # Financial reports
├── notifications/    # System notifications
├── receivables/      # Customer receivables
├── payables/         # Supplier payables
├── stock-movements/  # Inventory movements
├── business-users/   # User business assignments
└── main.ts          # Application entry point
```

### Service Layer Pattern

Each module follows:
1. **DTO (Data Transfer Object)** - Request/response validation
2. **Service** - Business logic and database operations
3. **Controller** - HTTP endpoints and routing
4. **Module** - Feature module grouping

## Error Handling

All endpoints return standardized error responses:
- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `409 Conflict` - Business logic violations
- `500 Internal Server Error` - Server errors

## Notes

- All IDs use UUID v4 format (except categories which use auto-increment)
- Decimal fields use PostgreSQL DECIMAL(12,2) for currency
- Soft deletes are not implemented; deleted records are permanently removed
- Multi-tenancy is enforced at the business level
- Pagination uses skip/take parameters (default: 10 items)

## License

UNLICENSED
