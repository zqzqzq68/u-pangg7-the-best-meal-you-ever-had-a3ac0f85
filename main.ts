// The Best Meal You Ever Had — make.fun bounty
// u-pangg7-the-best-meal-you-ever-had-a3ac0f85
//
// The program writes exactly one sentence, at most 200 characters,
// about the best meal the author ever had, to /output/entry.txt.
// It is fully deterministic: the same sentence is written on every run,
// so the two grading runs produce byte-identical output.
//
// The sentence is written below, by hand, as a single string constant.
// Nothing is generated, sampled, or read from the environment at run
// time: the meal memory is fixed, and the program's only job is to
// check it against the gate (1-200 characters, not only whitespace,
// one sentence, one line) and deliver it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const SENTENCE =
  "At two in the morning, my grandmother pressed a bowl of pork-bone congee into my hands, and I ate it standing in her doorway, steam fogging my glasses, because I could not wait to sit down.";

const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

function validateEntry(text: string): string[] {
  const problems: string[] = [];
  if (text.length < 1 || text.length > MAX_CHARS) {
    problems.push(
      `length ${text.length} is outside the 1-${MAX_CHARS} character gate`,
    );
  }
  if (text.trim().length === 0) {
    problems.push("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("entry must be a single line");
  }
  if (text !== text.trim()) {
    problems.push("entry has leading or trailing whitespace");
  }
  const terminators = (text.match(/[.!?]/g) ?? []).length;
  if (terminators !== 1 || !text.endsWith(".")) {
    problems.push("entry must be exactly one sentence ending in a period");
  }
  return problems;
}

function main(): void {
  const problems = validateEntry(SENTENCE);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`invalid entry: ${problem}`);
    }
    process.exit(1);
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  // No trailing newline: the gate counts every character, so the file
  // holds the sentence and nothing else.
  writeFileSync(OUTPUT_PATH, SENTENCE, "utf8");
  // Read the file back and confirm it is byte-identical to the sentence
  // that passed validation, so a partial or altered write can never
  // slip through silently.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== SENTENCE) {
    console.error(
      `read-back mismatch: file holds ${written.length} characters, expected ${SENTENCE.length}`,
    );
    process.exit(1);
  }
  console.log(`read-back verified: ${written.length} characters match`);
  console.log(`wrote ${SENTENCE.length} characters to ${OUTPUT_PATH}`);
  console.log(SENTENCE);
}

main();
