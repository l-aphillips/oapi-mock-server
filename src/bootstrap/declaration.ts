import * as fs from "fs";
import { log } from "../utils/logger";

export const getDeclarationPaths = (declarationPath: string) => {
  const file = fs.readFileSync(declarationPath, "utf-8");
  const declaration = JSON.parse(file);
  log(`loaded declaration file at path ${declarationPath}`);
  return declaration.paths;
};
