import { CustomSnackBarService } from "../shared/components/custom-snack-bar/custom-snack-bar.service";
import { AuthService } from "./../services/auth.service";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: CustomSnackBarService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    /*return this.authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        return true; 
      })
    );*/

    return this.authService.isLoggedIn.pipe(
      take(1),

      map((isLoggedIn: boolean) => {

        if (!isLoggedIn) {
          
          this.router.navigate(["/public/sign-in"]);
          return false;
        }
        
        if (this.authService.isTokenExpired()) {
          this.authService.logout();
          this.snackBar.openSnackBar(
            "Sua sessão expirou, faça o login novamente.",
            null,
            "Warn"
          );
          return false;
        }
        this.authService.renewToken();
        return true;
      })
    );
  }
}
