import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { partSchema, type Part } from "./schema.ts";

async function readPart(filePath: string): Promise<Part> {
  let contents: string;

  try {
    contents = await readFile(filePath, "utf8");
  } catch (cause) {
    throw new Error(`Cannot read component file: ${filePath}`, { cause });
  }

  let data: unknown;

  try {
    data = JSON.parse(contents);
  } catch (cause) {
    throw new Error(`Invalid JSON in component file: ${filePath}`, { cause });
  }

  const result = partSchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid component in ${filePath}: ${result.error.message}`, {
      cause: result.error,
    });
  }

  return result.data;
}

// Node-only file access. Call from the server, CLI scripts or tests.
export async function loadParts(
  directory = join(process.cwd(), "data", "parts"),
): Promise<Part[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();

  const parts = await Promise.all(
    files.map((file) => readPart(join(directory, file))),
  );

  const seenIds = new Map<string, string>();

  for (const [index, part] of parts.entries()) {
    const previousFile = seenIds.get(part.id);

    if (previousFile !== undefined) {
      throw new Error(
        `Duplicate component ID "${part.id}" in ${previousFile} and ${files[index]}`,
      );
    }

    seenIds.set(part.id, files[index]);
  }

  return parts;
}
