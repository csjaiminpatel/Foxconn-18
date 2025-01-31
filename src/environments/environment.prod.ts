import {STATIC_CONF} from "./environment.static";

export const environment = {
  production: true,
  name: 'prod',
  ...STATIC_CONF,
};
