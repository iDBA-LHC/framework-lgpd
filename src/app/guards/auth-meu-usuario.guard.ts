import { Injectable } from "@angular/core";
import {
	ActivatedRoute, ActivatedRouteSnapshot, CanActivate,
	Router, RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { CustomSnackBarService } from "../shared/components/custom-snack-bar/custom-snack-bar.service";

@Injectable()
export class AuthMeuUsuarioGuard implements CanActivate {
  constructor(
    private activatedRoute: ActivatedRoute,
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

    /*
	console.log(next.queryParams);
    params.subscribe((data) => {
      console.log(data);
      console.log(data["id?"]);
    });*/

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
