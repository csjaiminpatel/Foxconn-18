import { Component, Inject, inject, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumAuthFlags, EnumAuthVars } from '../../models/auth.model';

@Component({
  selector: 'orion-platform-refresh-session',
  standalone: true,
  imports: [MatCardModule,MatIconModule,MatTooltipModule,MatProgressSpinnerModule],
  templateUrl: './refresh-session.component.html',
  styleUrl: './refresh-session.component.scss'
})
export class RefreshSessionComponent implements OnInit {
  countdown: number = 0;
  private countdownHandler: any;
  private oidcInitiatedHandler: any;
  private timeoutInSeconds: number = 0;
  isRefreshing: 'refreshing' | 'loading' | 'idle' = 'loading';

  private readonly oidcSecurityService= inject(OidcSecurityService);

  constructor(
    public dialogRef: MatDialogRef<RefreshSessionComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngOnInit(): void {
    const that = this;
    const cachedCountdown = sessionStorage.getItem(EnumAuthVars.SessionCounter);
    that.timeoutInSeconds =
      cachedCountdown && !isNaN(parseInt(cachedCountdown)) ? parseInt(cachedCountdown) : 60;

    that.oidcInitiatedHandler = setInterval(() => {
      if (sessionStorage.getItem(EnumAuthFlags.OidcInitiated)) {
        that.isRefreshing = 'idle';
        that.setCountdown();
        that.oidcInitiatedHandler ? clearInterval(that.oidcInitiatedHandler) : undefined;
      }
    }, 200);
  }

  onNoClick(): void {
    console.log('[Dialog Testing] Clicked on ---> No, signed me out');
    this.countdownHandler ? clearInterval(this.countdownHandler) : undefined;
    sessionStorage.removeItem(EnumAuthVars.SessionCounter);
    this.dialogRef.close(EnumAuthFlags.Logout);
  }

  async onYesClick(): Promise<void> {
    console.log('[Dialog Testing] Clicked on ---> Yes, keep me signed in');
    const that = this;
    that.isRefreshing = 'refreshing';
    that.countdownHandler ? clearInterval(that.countdownHandler) : undefined;

    let result = await that.oidcSecurityService
      .forceRefreshSession()
      .toPromise()
      .catch((e) => {
        console.log("catch will be execute")
        result = undefined;
      });

    setTimeout(() => {
      if (result) {
        that.isRefreshing = 'idle';
        that.dialogRef.close(EnumAuthFlags.RefreshSession);
      } else {
        console.log('[Dialog Testing] Error while refreshing session! (after Clicked on ---> Yes, keep me signed in)');
        that.isRefreshing = 'idle';
        that.dialogRef.close(EnumAuthFlags.Logout);
      }
    }, 100);
  }
  private setCountdown() {
    const that = this;
    that.countdownHandler ? clearInterval(that.countdownHandler) : undefined;
    that.countdown = that.timeoutInSeconds;
    that.countdownHandler = setInterval(() => {
      sessionStorage.setItem(EnumAuthVars.SessionCounter, `${that.countdown}`);
      if (that.countdown <= 0) {
        sessionStorage.removeItem(EnumAuthVars.SessionCounter);
        that.dialogRef.close(EnumAuthFlags.Logout);
      }
      that.countdown--;
    }, 1000);
  }
}
