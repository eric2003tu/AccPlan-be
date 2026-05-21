-- DropForeignKey
ALTER TABLE "owner_applications" DROP CONSTRAINT "owner_applications_business_id_fkey";

-- AlterTable
ALTER TABLE "owner_applications" ALTER COLUMN "business_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "owner_applications" ADD CONSTRAINT "owner_applications_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
