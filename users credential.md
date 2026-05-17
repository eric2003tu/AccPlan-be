# Users Credentials (Seeded)

This file lists the seeded users, their plaintext credentials (used only for local/dev seeding), their system role, and the businesses they belong to with full business details.

> Warning: Keep this file private. Passwords are plaintext only for local development and are hashed in the database.

## Summary
- Seed script: `prisma/seed.ts`
- Default admin: `admin@accplan.com` / `Admin@12345`

---

## Users (current — authoritative from DB)

1) Admin User
- Name: Admin User
- Email: admin@accplan.com
- Password: Admin@12345
- System role: ADMIN
- Businesses:
  - AccPlan Holdings Ltd (OWNER)
    - Legal name: AccPlan Holdings Limited
    - Tax ID: TAX-ACC-1001
    - Country: Rwanda
    - City: Kigali
  - Sunrise Retail Ltd (OWNER)
    - Legal name: Sunrise Retail Limited
    - Tax ID: TAX-SUN-1006
    - Country: Rwanda
    - City: Musanze

2) Eric Tuyishime
- Name: Eric Tuyishime
- Email: eric.tuyishime@accplan.com
- Password: User@12345
- System role: OWNER
- Businesses:
  - AccPlan Holdings Ltd (MANAGER)
    - Legal name: AccPlan Holdings Limited
    - Tax ID: TAX-ACC-1001
    - Country: Rwanda
    - City: Kigali
  - BlueStone Logistics Ltd (OWNER)
    - Legal name: BlueStone Logistics Limited
    - Tax ID: TAX-BLU-1007
    - Country: Rwanda
    - City: Rubavu

3) Ketia Isimbi
- Name: Ketia Isimbi
- Email: ketia.isimbi@accplan.com
- Password: User@12345
- System role: OWNER
- Businesses:
  - Kigali Traders Ltd (OWNER)
    - Legal name: Kigali Traders Limited
    - Tax ID: TAX-KIG-1002
    - Country: Rwanda
    - City: Kigali

4) Jean Claude
- Name: Jean Claude
- Email: jean.claude@accplan.com
- Password: User@12345
- System role: MANAGER
- Businesses:
  - Kigali Traders Ltd (MANAGER)
    - Legal name: Kigali Traders Limited
    - Tax ID: TAX-KIG-1002
    - Country: Rwanda
    - City: Kigali

5) Alice Mutesi
- Name: Alice Mutesi
- Email: alice.mutesi@accplan.com
- Password: User@12345
- System role: OWNER
- Businesses:
  - Greenfield Supplies Ltd (OWNER)
    - Legal name: Greenfield Supplies Limited
    - Tax ID: TAX-GRN-1003
    - Country: Kenya
    - City: Nairobi
  - Sunrise Retail Ltd (MANAGER)
    - Legal name: Sunrise Retail Limited
    - Tax ID: TAX-SUN-1006
    - Country: Rwanda
    - City: Musanze

6) Olivier Habimana
- Name: Olivier Habimana
- Email: olivier.habimana@accplan.com
- Password: User@12345
- System role: MANAGER
- Businesses:
  - Greenfield Supplies Ltd (MANAGER)
    - Legal name: Greenfield Supplies Limited
    - Tax ID: TAX-GRN-1003
    - Country: Kenya
    - City: Nairobi

7) Diane Mukamana
- Name: Diane Mukamana
- Email: diane.mukamana@accplan.com
- Password: User@12345
- System role: OWNER
- Businesses:
  - Horizon Services Ltd (OWNER)
    - Legal name: Horizon Services Limited
    - Tax ID: TAX-HZN-1004
    - Country: Uganda
    - City: Kampala
  - BlueStone Logistics Ltd (MANAGER)
    - Legal name: BlueStone Logistics Limited
    - Tax ID: TAX-BLU-1007
    - Country: Rwanda
    - City: Rubavu

8) Patrick Niyonzima
- Name: Patrick Niyonzima
- Email: patrick.niyonzima@accplan.com
- Password: User@12345
- System role: MANAGER
- Businesses:
  - Horizon Services Ltd (MANAGER)
    - Legal name: Horizon Services Limited
    - Tax ID: TAX-HZN-1004
    - Country: Uganda
    - City: Kampala

9) Sandra Uwase
- Name: Sandra Uwase
- Email: sandra.uwase@accplan.com
- Password: User@12345
- System role: OWNER
- Businesses:
  - Mount View Manufacturing Ltd (OWNER)
    - Legal name: Mount View Manufacturing Limited
    - Tax ID: TAX-MNT-1005
    - Country: Tanzania
    - City: Dar es Salaam

10) Kevin Rukundo
- Name: Kevin Rukundo
- Email: kevin.rukundo@accplan.com
- Password: User@12345
- System role: MANAGER
- Businesses:
  - Mount View Manufacturing Ltd (MANAGER)
    - Legal name: Mount View Manufacturing Limited
    - Tax ID: TAX-MNT-1005
    - Country: Tanzania
    - City: Dar es Salaam

---

Notes:
- The `system_role` column now reflects `ADMIN`, `OWNER`, `MANAGER`, or `NORMAL` per seeded data.
- Business membership roles (OWNER/MANAGER) remain authoritative in the `business_users` table; `system_role` is an application-level convenience derived during seeding.

If you want I can also include any additional non-standard seeded accounts present in the DB (they appear as extra entries), or keep this file limited to the main 10 seeded users.
