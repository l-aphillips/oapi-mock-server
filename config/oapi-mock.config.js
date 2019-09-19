module.exports = {
  declaration: "./cam-ws-swagger.json",
  mocks: {
    "/rs/corpus/{corpusName}": "./corpus-mock.js",
    "/rs/corpus": "./corpus-mock.js"
  },
  port: 9999
};
