import {STATIC_CONF} from "./environment.static";
export const environment = {
  production: true,
  name: 'deploy',
  ...STATIC_CONF,
};
