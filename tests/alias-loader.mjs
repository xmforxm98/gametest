import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const baseUrl = pathToFileURL(`${process.cwd()}/`);

export const resolve = async (specifier, context, nextResolve) => {
  if (specifier.startsWith("@/")) {
    const relativePath = specifier.slice(2);
    const withExtension = path.extname(relativePath)
      ? relativePath
      : `${relativePath}.ts`;
    const candidatePath = path.resolve(process.cwd(), withExtension);
    const fallbackPath = path.resolve(process.cwd(), relativePath);
    const resolvedPath = existsSync(candidatePath) ? candidatePath : fallbackPath;

    return {
      url: pathToFileURL(resolvedPath).href,
      shortCircuit: true,
    };
  }

  return nextResolve(specifier, context);
};
