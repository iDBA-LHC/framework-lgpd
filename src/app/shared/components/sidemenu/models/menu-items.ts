import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { MenuItemButton } from './buttons/menu-item-button';
import { OnInit } from '@angular/core';

export class MenuItems  {

    menuItems: MenuItemButton[] = [];

    constructor(private authService: AuthService){
        this.menuItems = [
            {
                label: "Usuário",
                link: "usuario",
                icon: "account_circle",
                hidden: false,
            },
            {
                label: "Empresa",
                link: "empresa",
                icon: "work",
                hidden: this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin ? false : true,
            },
           {
                label: "Area",
                link: "area",
                icon: "event_seat",
                hidden: false,
            },
            {
                label: "Base Legal",
                link: "base-legal",
                icon: "event_seat",
                hidden: false,
            },
            {
                label: "Ciclo de Vida",
                link: "ciclo-de-vida",
                icon: "event_seat",
                hidden: false,
            }, {
                label: "Forma Coleta",
                link: "forma-coleta",
                icon: "event_seat",
                hidden: false,
            }
        ];
    }
}
