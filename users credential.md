# Users Credentials (Seeded)

This file lists the plaintext credentials for the users created by the current seed script. These credentials are intended for local/dev use only.

> Warning: Keep this file private. Passwords are plaintext only for local development and are hashed in the database.

## Summary
- Seed script: `prisma/seed.ts`
- Seeded users: 6 (1 admin, 1 owner, 3 managers, 1 normal)
- Seeded businesses: 3 (all owned by the seeded owner)

---

## Seeded Users

0) Admin User
- Name: Admin User
- Email: admin@accplan.com
- Password: Admin@12345
- System role: ADMIN
- Businesses: none

1) Owner User
- Name: Owner User
- Email: owner@accplan.com
- Password: Owner@12345
- System role: OWNER
- Businesses:
  - Alpha Ventures Ltd (OWNER)
    - Legal name: Alpha Ventures Limited
    - Tax ID: TAX-ALP-0001
    - Country: Rwanda
    - City: Kigali
  - Beta Trading Ltd (OWNER)
    - Legal name: Beta Trading Limited
    - Tax ID: TAX-BET-0002
    - Country: Rwanda
    - City: Kigali
  - Gamma Supplies Ltd (OWNER)
    - Legal name: Gamma Supplies Limited
    - Tax ID: TAX-GAM-0003
    - Country: Rwanda
    - City: Kigali

2) Manager One
- Name: Manager One
- Email: manager1@accplan.com
- Password: Manager@12345
- System role: MANAGER
- Businesses:
  - Alpha Ventures Ltd (MANAGER)

3) Manager Two
- Name: Manager Two
- Email: manager2@accplan.com
- Password: Manager@12345
- System role: MANAGER
- Businesses:
  - Beta Trading Ltd (MANAGER)

4) Manager Three
- Name: Manager Three
- Email: manager3@accplan.com
- Password: Manager@12345
- System role: MANAGER
- Businesses:
  - Gamma Supplies Ltd (MANAGER)

5) Normal User
- Name: Normal User
- Email: normal@accplan.com
- Password: Normal@12345
- System role: NORMAL
- Businesses: none

---

Notes:
- These entries reflect the users created by `prisma/seed.ts` that were run during the recent migration/seed step.
- Do not commit this file to public repositories.

If you want, I can also (a) include the admin credentials here, (b) add direct DB IDs for each user, or (c) keep only a short summary. Tell me which you prefer.
