import { AuthService } from "./services/auth.service";
import { Observable } from "rxjs";
import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { MediaObserver, MediaChange } from "@angular/flex-layout";

import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router'

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;
  opened = true;
  over = "side";
  expandHeight = "42px";
  collapseHeight = "42px";
  displayMode = "flat";
  watcher: Subscription;

  public showOverlay = true;

  constructor(media: MediaObserver, 
              private authService: AuthService,
              private router: Router) {

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    });

    this.watcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === "sm" || change.mqAlias === "xs") {
        this.opened = false; // ALTERADO this.opened = false -- true
        this.over = "over"; // ALTERADO this.over = "over" -- side
      } else {
        this.opened = true;
        this.over = "side";
      }
    });
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  getSideNav() {
    if (this.opened) {
      this.opened = false; // ALTERADO this.opened = false
    } else {
      this.opened = true;
    }
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showOverlay = true;
    }
    if (event instanceof NavigationEnd) {
      this.showOverlay = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.showOverlay = false;
    }
    if (event instanceof NavigationError) {
      this.showOverlay = false;
    }
  }
}
