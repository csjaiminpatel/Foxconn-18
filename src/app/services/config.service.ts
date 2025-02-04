import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  private http: HttpClient = inject(HttpClient);
  constructor() {
  }

  async loadConfig() {
    try {
      this.config = await firstValueFrom(
        this.http.get(`/config/config.${environment.name}.json`)
      );
    } catch (error) {
      console.error('Could not load configuration', error);
    }
  }

  getConfig() {
    return this.config;
  }

  getSettings(key: string) {
    if (!this.config) {
      console.warn('Configuration not loaded yet.');
      return undefined;  // Return default value if config isn't loaded
    }
    if (this.config.hasOwnProperty(key)) {
      return this.config[key];
    } else {
      console.warn(`Key "${key}" not found in configuration.`);
      return undefined;  // Return default value if key is missing
    }
  }
  
}
