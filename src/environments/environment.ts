import {STATIC_CONF} from "./environment.static";

export const environment = {
  production: false,
  name: 'dev',
  ...STATIC_CONF,
};
