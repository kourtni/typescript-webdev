import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { ExecaError } from "execa";
import { execaSync as $ } from "execa";
import tsConfig from "./tsconfig.json";

// Asserts that the generated types and graphql schema are up to date

const {
  grats: { tsSchema, graphqlSchema },
} = tsConfig;

const tsBefore = fs.readFileSync(tsSchema, "utf-8");
const gqlBefore = fs.readFileSync(graphqlSchema, "utf-8");

$("pnpm codegen");

const tsAfter = fs.readFileSync(tsSchema, "utf-8");
const gqlAfter = fs.readFileSync(graphqlSchema, "utf-8");

fs.writeFileSync(tsSchema, tsBefore);
fs.writeFileSync(graphqlSchema, gqlBefore);

assertIdentical(tsSchema, tsBefore, tsAfter);
assertIdentical(graphqlSchema, gqlBefore, gqlAfter);

function assertIdentical(file: string, a: string, b: string) {
  try {
    const f1 = tempFile(a);
    const f2 = tempFile(b);
    $("diff", ["-u", "--label", "A", f1.path, "--label", "B", f2.path]);
    f1.release();
    f2.release();
    console.log(`✅  ${file} is up to date!`);
  } catch (_) {
    const e = _ as ExecaError;
    if (e.stderr) {
      console.log("Unexpected error:", e.stderr);
    } else {
      console.log(
        `❌  ${file} out of date. Run codegen and commit changes.\n` + e.stdout,
      );
    }
    process.exit(1);
  }
}

function tempFile(content: string) {
  const temp = path.resolve(os.tmpdir(), Math.random().toString(36).slice(2));
  fs.writeFileSync(temp, content);
  return {
    path: temp,
    release: () => fs.rmSync(temp),
  };
}
