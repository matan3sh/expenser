-- First add the column with a default value
ALTER TABLE "categories" ADD COLUMN "color" TEXT DEFAULT '#64748b';

-- Then remove the default constraint
ALTER TABLE "categories" ALTER COLUMN "color" DROP DEFAULT; 