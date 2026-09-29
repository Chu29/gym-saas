#!/usr/bin/env bash
# STEP: add SaasPlan.description (optional String), confirmed with Sanch.
# Run from the monorepo ROOT.
set -euo pipefail

SCHEMA="packages/database/prisma/schema.prisma"
[ -f "$SCHEMA" ] || { echo "ERROR: $SCHEMA not found. Run from the monorepo root."; exit 1; }
[ -f "packages/database/.env" ] || { echo "ERROR: packages/database/.env not found (needs DATABASE_URL)."; exit 1; }

cp "$SCHEMA" "$SCHEMA.bak_desc"
echo ">> Backed up to $SCHEMA.bak_desc"

python3 - "$SCHEMA" <<'PYEOF'
import sys
path = sys.argv[1]
s = open(path).read()

old = '''model SaasPlan {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  code          String   @unique
  priceCents    Int
  currency      String   @default("USD")
  maxMembers    Int
  maxStaff      Int
  stripePriceId String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tenants Tenant[]

  @@map("saas_plans")
}'''
new = '''model SaasPlan {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  description   String?
  code          String   @unique
  priceCents    Int
  currency      String   @default("USD")
  maxMembers    Int
  maxStaff      Int
  stripePriceId String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tenants Tenant[]

  @@map("saas_plans")
}'''

if old not in s:
    print("ERROR: SaasPlan model doesn't match the expected baseline (schema has changed again).")
    print("Paste the current schema.prisma before rerunning this script. No changes made.")
    sys.exit(1)
if s.count(old) != 1:
    print("ERROR: SaasPlan model block matched more than once. Aborting.")
    sys.exit(1)

s = s.replace(old, new)
open(path, "w").write(s)
print("OK: SaasPlan.description added")
PYEOF

echo ">> Diff:"
diff -u "$SCHEMA.bak_desc" "$SCHEMA" || true

echo; echo ">> prisma format"
pnpm --filter "*database*" exec prisma format

echo; echo ">> prisma generate"
pnpm db:generate

echo; echo ">> prisma db push"
pnpm --filter "*database*" exec prisma db push

echo; echo ">> biome format"
pnpm exec biome format --write packages/database || echo "WARN: biome formatting failed; run 'pnpm lint:fix' before committing."

cat <<MSG

=======================================================
 SaasPlan.description added and pushed to Atlas.
 Backup: $SCHEMA.bak_desc

 Next: paste your CreatePlanDto file so I can add
 `description?: string` to it correctly (with whatever
 validation decorators the rest of the DTO uses).
=======================================================
MSG
