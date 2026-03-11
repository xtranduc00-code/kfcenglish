#!/usr/bin/env node
/**
 * Dev-only: print bcrypt hash for use in SQL:
 *   UPDATE auth_users SET password_hash = '<paste>' WHERE username = 'kenkfc';
 * Matches lib/password.ts (bcryptjs, 10 rounds).
 */
import bcrypt from "bcryptjs";
const plain = process.argv[2];
if (!plain) {
    console.error("Usage: npm run hash-password -- <your-new-password>");
    process.exit(1);
}
process.stdout.write(bcrypt.hashSync(plain, 10) + "\n");
