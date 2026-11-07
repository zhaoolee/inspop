#!/usr/bin/env node
/**
 * Publish ./out only after proving next export copied the local public assets.
 *
 * next export places public/wallpapers and public/av at the root of out/.
 * rsync --delete would otherwise remove mp3/mp4 that exist only on the server
 * because those extensions are gitignored and are absent from a fresh checkout.
 * protect keeps receiver files that the local out/ does not contain.
 * Files that are present in out/ are still uploaded.
 *
 * Usage, from next-inspop, after a successful export:
 *   npm run publish
 * Override the destination with INSPOP_PUBLISH_TARGET.
 * This script does not build; it refuses to run when out/ is incomplete.
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = __dirname;
const outDir = path.join(root, "out");
const publicDir = path.join(root, "public");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

if (!fs.existsSync(outDir)) {
  console.error("out/ is missing. From next-inspop run: npm run export");
  console.error("next export copies public/ into out/ (wallpapers, av, json).");
  process.exit(1);
}

const required = walk(publicDir).filter((file) => {
  const rel = path.relative(publicDir, file);
  if (rel === ".DS_Store" || rel.includes(`${path.sep}.DS_Store`)) return false;
  return (
    rel === "inspop-data.csv" ||
    rel === "wallpapers-info.json" ||
    rel === "av-info.json" ||
    rel.startsWith(`wallpapers${path.sep}`) ||
    rel.startsWith(`av${path.sep}`)
  );
});

const missing = [];
for (const src of required) {
  const rel = path.relative(publicDir, src);
  const dest = path.join(outDir, rel);
  if (!fs.existsSync(dest) || fs.statSync(dest).size !== fs.statSync(src).size) {
    missing.push(rel);
  }
}

if (missing.length) {
  console.error(
    `Refusing to publish. ${missing.length} public asset(s) are not in out/.`
  );
  console.error("next export should copy them. First missing paths:");
  missing.slice(0, 20).forEach((rel) => console.error(`  ${rel}`));
  process.exit(1);
}

const remote =
  process.env.INSPOP_PUBLISH_TARGET ||
  "root@fangyuanxiaozhan.com:/usr/share/nginx/inspop.fangyuanxiaozhan.com/";

const result = spawnSync(
  "rsync",
  [
    "-avz",
    "--delete",
    "--filter=protect *.mp3",
    "--filter=protect *.mp4",
    `${outDir}/`,
    remote,
  ],
  { stdio: "inherit" }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status === null ? 1 : result.status);
