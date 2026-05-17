-- Safe migration: add user_system_role enum and system_role column if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_system_role') THEN
    CREATE TYPE user_system_role AS ENUM ('NORMAL','ADMIN');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='users' AND column_name='system_role'
  ) THEN
    ALTER TABLE "users" ADD COLUMN system_role user_system_role NOT NULL DEFAULT 'NORMAL';
  END IF;
END$$;

-- Ensure the seeded admin account is ADMIN
UPDATE "users" SET system_role='ADMIN' WHERE email='admin@accplan.com';
