import { App } from './app';
import { ValidateEnv } from './utils/validateEnv';

ValidateEnv();

const server = new App();

server.listen();
