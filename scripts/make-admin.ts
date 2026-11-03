import "dotenv/config";
import { neon } from "@neondatabase/serverless";

// Usage: pnpm db:make-admin someone@example.com
// The user must have signed up first; the dashboard only admits role = 'admin'.
async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    throw new Error("Usage: pnpm db:make-admin <email>");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    update neon_auth."user" set role = 'admin', "updatedAt" = now()
    where lower(email) = ${email}
    returning email, role
  `;

  if (!rows.length) {
    throw new Error(`No user with email ${email}. Ask them to sign up at /sign-up first.`);
  }

  // eslint-disable-next-line no-console
  console.log(`${rows[0].email} is now ${rows[0].role}.`);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
