# Quick Start Guide

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
# or if using pnpm
pnpm install
```

**New packages added:**
- `@nestjs/swagger` - API documentation
- `class-validator` - DTO validation
- `class-transformer` - Object transformation
- `uuid` - UUID generation

### Step 2: Database Setup
Ensure your `.env` file has:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/accplan"
PORT=3000
```

Run migrations:
```bash
npx prisma migrate dev
```

### Step 3: Start Development Server
```bash
npm run start:dev
```

You should see output like:
```
[Nest] 12345 - 01/01/2024, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345 - 01/01/2024, 10:00:00 AM     LOG [InstanceLoader] PrismaModule dependencies initialized
...
[Nest] 12345 - 01/01/2024, 10:00:00 AM     LOG [NestApplication] Nest application successfully started
```

### Step 4: Access Swagger Documentation
Open in your browser:
```
http://localhost:3000/api/docs
```

## What Was Generated

✅ **21 Complete CRUD Modules** with:
- Full REST endpoints (GET, POST, PUT, DELETE)
- Input validation (DTOs)
- Error handling
- Swagger documentation
- Pagination support

### Modules Include:
- Users, Business, Business Users
- Products, Categories, Contacts, Warehouses
- Sales, Sale Items
- Purchases, Purchase Items
- Accounts, Journal Entries, Journal Lines, Fiscal Years
- Reports, Notifications
- Receivables, Payables
- Stock Movements

## API Features

✨ **All endpoints include:**
- `@ApiOperation` - Operation description
- `@ApiResponse` - Response documentation
- `@ApiQuery` - Query parameter documentation
- Status codes (201 for create, 200 for success, 404 for not found)
- Automatic pagination with skip/take

## Example API Calls

### Using Swagger UI (Easiest)
1. Go to http://localhost:3000/api/docs
2. Click on any endpoint
3. Fill in the "Try it out" form
4. Click "Execute"

### Using cURL

**Create a User:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

**Get All Users:**
```bash
curl http://localhost:3000/users?skip=0&take=10
```

**Get Single User:**
```bash
curl http://localhost:3000/users/[user-id]
```

**Update User:**
```bash
curl -X PUT http://localhost:3000/users/[user-id] \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Janet",
    "email": "janet@example.com"
  }'
```

**Delete User:**
```bash
curl -X DELETE http://localhost:3000/users/[user-id]
```

## Endpoint Summary

| Resource | Base URL | Methods |
|----------|----------|---------|
| Users | /users | GET, POST, PUT, DELETE |
| Business | /business | GET, POST, PUT, DELETE |
| Products | /products | GET, POST, PUT, DELETE |
| Sales | /sales | GET, POST, PUT, DELETE |
| Purchases | /purchases | GET, POST, PUT, DELETE |
| Accounts | /accounts | GET, POST, PUT, DELETE |
| Reports | /reports | GET, POST, PUT, DELETE |
| And 13 more... | | GET, POST, PUT, DELETE |

*See CRUD_API_GUIDE.md for complete endpoint documentation*

## Common Issues & Solutions

### Issue: "Cannot find module '@nestjs/swagger'"
**Solution:** Run `npm install` again

### Issue: "Database connection error"
**Solution:** 
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Run `npx prisma migrate dev`

### Issue: "Port 3000 already in use"
**Solution:** 
- Use different port: `PORT=3001 npm run start:dev`
- Or kill the process using port 3000

### Issue: Swagger UI is blank
**Solution:**
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for errors
- Ensure server is running on port 3000

## Development Workflow

1. **Modify DTOs**: Update validation in `src/[module]/dto/`
2. **Add business logic**: Update `src/[module]/[module].service.ts`
3. **Modify endpoints**: Update `src/[module]/[module].controller.ts`
4. **Server auto-reloads** with `npm run start:dev`
5. **Test in Swagger UI** at http://localhost:3000/api/docs

## Production Build

```bash
npm run build
npm run start:prod
```

## File Organization

Each module follows this structure:
```
src/[module]/
├── dto/
│   └── [module].dto.ts          # Request/Response DTOs
├── [module].service.ts           # Business logic
├── [module].controller.ts        # HTTP endpoints
└── [module].module.ts            # Module configuration
```

## Documentation Files

- **CRUD_API_GUIDE.md** - Comprehensive API documentation
- **This file** - Quick start guide
- **Swagger UI** - Interactive API documentation at `/api/docs`

## Next Steps

1. ✅ Install dependencies
2. ✅ Start server
3. ✅ Open Swagger UI
4. ✅ Test some endpoints
5. ✅ Integrate with your frontend
6. ✅ Customize DTOs/business logic as needed

## Support

For detailed endpoint documentation, see: `CRUD_API_GUIDE.md`

All endpoints are documented in Swagger at: `http://localhost:3000/api/docs`
