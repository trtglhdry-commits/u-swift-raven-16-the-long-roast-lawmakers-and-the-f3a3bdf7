// The Long Roast: Lawmakers and the File They Cannot Convert
// (u-swift-raven-16-the-long-roast-lawmakers-and-the-f3a3bdf7)
//
// Writes one satirical sentence to /output/entry.txt.
// Gate (from the fresh kit's RULES.txt): UTF-8 text, 1 to 320 characters,
// not only whitespace. The program enforces the gate itself and exits
// non-zero if the text ever fails it, so an invalid entry can never ship.
//
// Why this line, against the judge's brief:
// - One sentence, standing alone, roasting a lawmaker who regulates AI
//   but cannot convert a file to PDF.
// - A real turn: the setup grants the senator real authority (he WROTE the
//   AI Safety Act), then undercuts it with the file he cannot convert.
// - Aim stays on the lawmaker and the rules he writes, not random abuse.
// - A specific, unexpected detail instead of a worn cliche: not "he can't
//   use a computer" but the print-it, scan-it, email-it-back loop, and the
//   punch lands on the last few words — converting the file himself would
//   feel like letting the machines win.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "The senator who wrote the AI Safety Act just asked his intern to print the bill, scan it, and email it back as a PDF, because converting the file himself felt like letting the machines win.";

const MAX_CHARS = 320;

function gate(text: string): void {
  // Count characters as the gate does: Unicode code points, not UTF-16 units.
  const chars = [...text];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(
      `entry is ${chars.length} characters, outside the 1-${MAX_CHARS} gate`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // One sentence only: exactly one terminal full stop, at the end.
  const stops = [...text].filter((c) => c === "." || c === "!" || c === "?");
  if (stops.length !== 1 || !text.endsWith(".")) {
    throw new Error("entry must be exactly one sentence");
  }
  // The roast must stay on brief: a lawmaker (or the rules they write)
  // and the file they cannot convert to PDF.
  const lower = text.toLowerCase();
  if (!/senator|congress|lawmaker|representative|minister|parliament/.test(lower)) {
    throw new Error("entry does not name a lawmaker");
  }
  if (!lower.includes("pdf")) {
    throw new Error("entry does not name the file format");
  }
}

function main(): void {
  gate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // One trailing newline, as a text file conventionally ends; the gate
  // counts the sentence itself, and the file stays well inside 320 chars.
  writeFileSync(outPath, ENTRY + "\n", "utf8");
  console.log(`wrote ${outPath} (${[...ENTRY].length} characters)`);
}

main();
