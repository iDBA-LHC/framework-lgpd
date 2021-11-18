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
import { MenuItems } from '../shared/components/sidemenu/models/menu-items';
import { MenuItemButton } from '../shared/components/sidemenu/models/buttons/menu-item-button';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: CustomSnackBarService,
    
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    

    return this.authService.isLoggedIn.pipe(
      take(1),

      map((isLoggedIn: boolean) => {

        var menuItems: MenuItems = new MenuItems(this.authService);      

        var menuItemButton:MenuItemButton = <MenuItemButton> menuItems.menuItems.filter(menuItem => menuItem.link == next.routeConfig.path)[0];

        //Se não for parte do menu principal, procurar nos sub-menus
        if (menuItemButton === undefined)
        {
          menuItems.menuItems.forEach(element => {
            if (element.items != undefined)
            {
              var menuItemButtonaux:MenuItemButton = element.items.filter(aux => aux.link == next.routeConfig.path)[0];
              if (menuItemButtonaux!==undefined)
              {
                menuItemButton = menuItemButtonaux;
              }
            }
          });
        }

        if ((!menuItemButton || menuItemButton.hidden) && 
             (next.routeConfig.path != "home") && 
             (next.routeConfig.path != "muda-senha") &&
             (next.routeConfig.path != "nova-senha") &&
             (next.routeConfig.path.length != 0))
        {
          this.snackBar.openSnackBar(
            "Você Não Tem Permissão de Acesso a Esta Página",
            null,
            "Warn"
          );
          this.router.navigate(["/home"]);
          return false;
        }            

        if (!isLoggedIn &&  next.routeConfig.path != "nova-senha"){          
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
