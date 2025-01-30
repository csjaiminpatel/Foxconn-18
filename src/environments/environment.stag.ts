import {STATIC_CONF} from "./environment.static";

export const environment = {
  production: false,
  name: 'stag',
  ...STATIC_CONF,
};
