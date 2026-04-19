const { exec } = require("node:child_process");
const fs = require("node:fs");
const yaml = require("js-yaml");

generateSwagger();

function generateSwagger() {
  const config = findConfig();
  for (const module of config.swagger.modules) {
    let command;
    if (!module.url.includes("http")) {
      command = `npx openapi-typescript ${config.swagger.url}/swagger-ui/${module.url}.json -o ${__dirname}/../types/${module.path}_schema.ts --make-paths-enum --version 2`;
    } else {
      command = `npx openapi-typescript ${module.url} -o ${__dirname}/../types/${module.path}_schema.ts --make-paths-enum --version 2`;
    }

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    });
  }
}

function findConfig() {
  const configFilePath = `${__dirname}/../../config.yaml`;
  const configFile = fs.readFileSync(configFilePath, "utf8");

  return yaml.load(configFile);
}
