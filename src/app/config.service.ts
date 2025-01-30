import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, runInInjectionContext } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  private http: HttpClient = inject(HttpClient);
  constructor() {}

  async loadConfig() {
    try {
        this.config = await firstValueFrom(this.http.get(`/public/config/config.${environment.name}.json`));
    } catch (error) {
      console.error('Could not load configuration', error);
    }
  }

  getConfig() {
    return this.config;
  }

}
