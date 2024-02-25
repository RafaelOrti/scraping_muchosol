import { cleanEnv, port, str } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    URL_EL_MUNDO: str(),
    URL_EL_PAIS: str(),
  });
};
