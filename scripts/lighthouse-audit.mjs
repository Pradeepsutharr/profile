#!/usr/bin/env node
/**
 * Run Lighthouse categories on public routes and print a score table.
 * Usage: node scripts/lighthouse-audit.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const base = (process.argv[2] || "http://127.0.0.1:3010").replace(/\/$/, "");
const outDir = path.join(process.cwd(), ".lighthouse");
mkdirSync(outDir, { recursive: true });

const routes = [
  "/",
  "/resume",
  "/work",
  "/blog",
  "/services",
  "/contact",
  "/work/intend-it",
  "/blog/figma-to-react-best-practices-developer-handoff",
  "/services/product-design",
];

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(err || `${cmd} exited ${code}`));
    });
  });
}

const results = [];
for (const route of routes) {
  const url = `${base}${route}`;
  const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "__");
  const output = path.join(outDir, slug);
  console.log(`Auditing ${url} …`);
  await run("npx", [
    "--yes",
    "lighthouse",
    url,
    "--quiet",
    "--chrome-flags=--headless --no-sandbox --disable-gpu",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    `--output-path=${output}.json`,
    "--form-factor=mobile",
    "--screenEmulation.mobile=true",
    "--throttling-method=simulate",
  ]);
  const report = JSON.parse(readFileSync(`${output}.json`, "utf8"));
  const cats = report.categories;
  const row = {
    route,
    performance: Math.round((cats.performance?.score || 0) * 100),
    accessibility: Math.round((cats.accessibility?.score || 0) * 100),
    bestPractices: Math.round((cats["best-practices"]?.score || 0) * 100),
    seo: Math.round((cats.seo?.score || 0) * 100),
    audits: Object.values(report.audits || {})
      .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== "informative")
      .map((a) => ({
        id: a.id,
        title: a.title,
        score: a.score,
        category: Object.entries(cats).find(([, c]) =>
          (c.auditRefs || []).some((r) => r.id === a.id),
        )?.[0],
      }))
      .filter((a) => ["performance", "accessibility", "best-practices", "seo"].includes(a.category))
      .slice(0, 25),
  };
  results.push(row);
  console.log(
    `  P:${row.performance} A:${row.accessibility} BP:${row.bestPractices} SEO:${row.seo}`,
  );
}

writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(results, null, 2));
console.log("\n=== SUMMARY ===");
for (const row of results) {
  console.log(
    `${row.route.padEnd(48)} P=${row.performance} A=${row.accessibility} BP=${row.bestPractices} SEO=${row.seo}`,
  );
}
console.log(`\nWrote ${outDir}/summary.json`);
// Aggregate failing audits
const failMap = new Map();
for (const row of results) {
  for (const a of row.audits) {
    const key = `${a.category}:${a.id}`;
    if (!failMap.has(key)) failMap.set(key, { ...a, routes: [] });
    failMap.get(key).routes.push(row.route);
  }
}
console.log("\n=== TOP FAILING AUDITS ===");
[...failMap.values()]
  .sort((a, b) => a.score - b.score || b.routes.length - a.routes.length)
  .slice(0, 40)
  .forEach((a) => {
    console.log(`[${a.category}] ${a.id} (${a.score}) - ${a.routes.length} pages`);
  });
