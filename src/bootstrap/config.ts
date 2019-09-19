import { getProcessArguments } from "./process";
import { IBootstrapConfig } from "./bootstrap.types";
import * as fs from "fs";
import * as path from "path";
import { log, warn } from "../utils/logger";

const DEFAULT_CONFIG: IBootstrapConfig = {
  declaration: "./open-api-config.json",
  mocks: {},
  additionalMocks: [],
  port: 3030
};
// TODO: get absolute config path
const getExecutionFilePath = (filePath: string) =>
  path.resolve(process.cwd(), filePath);

const prepareResolveToFileDir = (relatedFilePath: string) => {
  const dir = path.dirname(relatedFilePath);
  return (filePath: string) => path.resolve(dir, filePath);
};

const prepareNormalizedConfigPaths = (configFilePath: string) => (
  config: IBootstrapConfig
) => {
  const { declaration, mocks } = config;
  const resolve = prepareResolveToFileDir(configFilePath);
  return {
    ...config,
    declaration: resolve(declaration),
    mocks: Object.entries(mocks).reduce(
      (mocks, [url, mockPath]) => ({ ...mocks, [url]: resolve(mockPath) }),
      {}
    )
  } as IBootstrapConfig;
};

export const readConfig = () => {
  const processArguments = getProcessArguments();
  const configPath = processArguments["--config"];
  const execConfigPath = getExecutionFilePath(configPath);
  // TODO: better naming
  const normalizeConfigPaths = prepareNormalizedConfigPaths(execConfigPath);

  const configExists = fs.existsSync(execConfigPath);

  if (configExists) {
    // TODO: add JS based validation;
    const config = require(execConfigPath) as IBootstrapConfig;
    log(`loaded config at path: ${execConfigPath}`);

    return normalizeConfigPaths({
      ...DEFAULT_CONFIG,
      ...config
    });
  }
  warn(`config not found loading default config`);
  return normalizeConfigPaths(DEFAULT_CONFIG);
};
