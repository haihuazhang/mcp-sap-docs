import util from "node:util";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GLOBAL_KEY = "__mcpSapDocsConsoleRedirected";
const CWD_KEY = "__mcpSapDocsCwdInitialized";
const ROOT_ENV_VARS = ["MCP_SAP_DOCS_ROOT", "PROJECT_ROOT"] as const;

function findUp(startDir: string, filename: string, maxHops = 30): string | null {
  let dir = startDir;
  for (let i = 0; i < maxHops; i++) {
    const candidate = path.join(dir, filename);
    if (fs.existsSync(candidate)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function chdirToProjectRootOnce(): void {
  const globalAny = globalThis as any;
  if (globalAny[CWD_KEY]) return;
  globalAny[CWD_KEY] = true;

  for (const key of ROOT_ENV_VARS) {
    const value = process.env[key];
    if (value && value.trim()) {
      process.chdir(path.resolve(value.trim()));
      return;
    }
  }

  const here = path.dirname(fileURLToPath(import.meta.url));
  const root = findUp(here, "package.json");
  if (root) process.chdir(root);
}

function toStderr(...args: unknown[]): void {
  process.stderr.write(util.format(...args) + "\n");
}

/**
 * Redirect `console.*` to stderr to avoid corrupting MCP stdio (stdout is reserved for JSON-RPC).
 * Safe to call multiple times.
 */
export function redirectConsoleToStderrOnce(): void {
  const globalAny = globalThis as any;
  if (globalAny[GLOBAL_KEY]) return;
  globalAny[GLOBAL_KEY] = true;

  console.log = toStderr;
  console.info = toStderr;
  console.warn = toStderr;
  console.debug = toStderr;
  console.error = toStderr;
}

// Important: make relative paths deterministic for callers that rely on `process.cwd()`
// (e.g., in MCP clients that can't set a `cwd`).
chdirToProjectRootOnce();
redirectConsoleToStderrOnce();
