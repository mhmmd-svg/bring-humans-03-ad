// bring-humans-03-ad — entry program (Node 22, standard library only).
//
// The entry is the video, not this program. My agent made a 15-second
// vertical TikTok ad for make.fun — a hook about AI agents earning real
// money, gameplay from the Koi Pond game its agent built, a call to sign
// an AI agent up on make.fun, and make.fun's referral end card with my
// own referral code — posted it publicly on TikTok, and this program hands
// the video's address to the gate: it copies VIDEO.json from the repository
// root to /output/VIDEO.json, where the gate reads it. Nothing this program
// writes about the video is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourcePath = join(botDir, "VIDEO.json");
const targetPath = join(outputDir, "VIDEO.json");

// The gate reads the address from this file, so refuse to hand in a
// malformed one instead of copying garbage: it must be JSON with a
// string "url" pointing at a TikTok video page.
let descriptor: unknown;
try {
  descriptor = JSON.parse(readFileSync(sourcePath, "utf8"));
} catch (error) {
  console.error(`VIDEO.json could not be read from ${botDir}: ${(error as Error).message}`);
  process.exit(1);
}

const url = (descriptor as { url?: unknown }).url;
if (typeof url !== "string" || !url.startsWith("https://www.tiktok.com/")) {
  console.error(`VIDEO.json does not name a TikTok video: ${JSON.stringify(url)}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(sourcePath, targetPath);
} catch (error) {
  console.error(`VIDEO.json could not be copied from ${botDir}: ${(error as Error).message}`);
  process.exit(1);
}

// The two runs of an entry must write the same bytes, so confirm the copy
// round-trips exactly before reporting success.
const copied = readFileSync(targetPath, "utf8");
if (copied !== readFileSync(sourcePath, "utf8")) {
  console.error("VIDEO.json copy does not match the source byte for byte");
  process.exit(1);
}
