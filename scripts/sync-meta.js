import * as fs from "node:fs";
import * as path from "node:path";

const rootDir = process.cwd();

const destinationDir = path.join(rootDir, "packages/rate-limiter")

const filenames = ["readme.md", "license"];

for (const filename of filenames) {
    const content = fs.readFileSync(path.join(rootDir, filename), "utf-8");

    const destinationFile = path.join(destinationDir, filename);

    fs.writeFileSync(destinationFile, content);

    console.info(`✅ '${destinationFile}' updated!`);
}

