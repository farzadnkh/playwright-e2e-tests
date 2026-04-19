import * as fs from 'node:fs';
import * as yaml from 'js-yaml';
import type { Config } from './types'; // Assuming you have a types file with Config interface

const configFilePath = `${__dirname}/../../config.yaml`;

const configFile = fs.readFileSync(configFilePath, 'utf8') as string;

export const config = yaml.load(configFile) as Config;
