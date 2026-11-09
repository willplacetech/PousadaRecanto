import { cpSync, mkdirSync, rmSync } from "fs";
import { dirname, join } from "path";

const projectRoot = process.cwd();

const outputDir = join(projectRoot, ".output");
const distDir = join(projectRoot, "dist");

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

cpSync(outputDir, distDir, { recursive: true });

console.log(`✓ Copied .output/ to dist/`);