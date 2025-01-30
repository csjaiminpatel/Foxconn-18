import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './app/config.service';

export function loadConfig(configService: ConfigService) {
  return () => configService.loadConfig(); // This will run before app initialization
}

async function main() {
  await bootstrapApplication(AppComponent, {
    providers: [
      ...appConfig.providers,
      // Use the APP_INITIALIZER to load the config before the app starts
      {
        provide: APP_INITIALIZER,
        useFactory: loadConfig,
        deps: [ConfigService],
        multi: true,
      },
    ],
  }).catch((err) => console.error(err));
}

main();