import * as fs from "fs";
import express from "express";
import { readConfig } from "./config";
import { getDeclarationPaths } from "./declaration";
import { HttpMethods, RestHandlers } from "./bootstrap.types";
import { log } from "../utils/logger";

const server = express();
server.use(express.json());

const convertToExpressPath = (path: string) => {
  const open = new RegExp("{", "g");
  const close = new RegExp("}", "g");
  return path.replace(open, ":").replace(close, "");
};

const prepareHandler = (path: string) => (method: string) => () => {
  console.log(`REQUEST: [${method}] ${path}`);
  return { message: "Not implemented!" };
};

const getRestHandler: (path: string) => RestHandlers = (path: string) => {
  const handler = prepareHandler(path);
  return {
    get: handler("GET"),
    post: handler("POST"),
    delete: handler("DELETE"),
    put: handler("PUT")
  };
};

export const bootstrap = () => {
  const config = readConfig();
  // TODO: add type for declaration paths
  const declarationApiPaths = getDeclarationPaths(config.declaration);

  Object.entries(declarationApiPaths).forEach(
    ([openApiPath, declarationApiPathConfig]) => {
      const restHandlers = config.mocks[openApiPath];
      const expressPath = convertToExpressPath(openApiPath);
      const idleRestHandler = getRestHandler(expressPath);
      const restHandler = fs.existsSync(restHandlers)
        ? { ...idleRestHandler, ...require(restHandlers) }
        : idleRestHandler;
      const methods = Object.keys(declarationApiPathConfig);

      methods.forEach((method: HttpMethods) => {
        const handler = restHandler[method];

        (server as any)[method](
          expressPath,
          (req: express.Request, resp: express.Response) => {
            const result = handler(req.params, req.body);
            resp.json(result);
          }
        );
      });
      log(`route [${methods}]: ${expressPath}`, "🛩️");
    }
  );

  server.listen(config.port);
};
