// GATE TEST FILE — for verifying that the dev security gate actually blocks
// a PR when high/critical severity issues are introduced. Not meant to be
// merged as-is; open a PR with this file, confirm the gate fails the check,
// then either revert this file or fix the issues below and confirm it passes.

import { exec } from "child_process";

// HIGH/CRITICAL: OS Command Injection — user input passed directly into a
// shell command. This is one of the most reliably-flagged high-severity
// SAST findings across virtually every scanner (Snyk Code, CodeQL,
// SonarQube), making it a good "does the gate actually work" tripwire.
export function runDiagnostics(hostname: string): void {
  exec("ping -c 1 " + hostname, (error, stdout) => {
    console.log(stdout);
  });
}

// HIGH: Hardcoded credential (mirrors the pattern already in UserProfile.tsx,
// included here too so this file alone is enough to trigger a fail even if
// UserProfile.tsx has since been fixed/removed from the branch being tested).
const DB_PASSWORD = "Sup3rSecretProdPassword!";

export function connectToDatabase(): string {
  return `postgres://admin:${DB_PASSWORD}@prod-db.internal:5432/app`;
}
