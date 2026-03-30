import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const backendDir = resolve("backend");
const envPath = resolve(backendDir, ".env");
const envExamplePath = resolve(backendDir, ".env.example");

if (!existsSync(envPath) && existsSync(envExamplePath)) {
  copyFileSync(envExamplePath, envPath);
  console.log("Created backend/.env from backend/.env.example");
}
