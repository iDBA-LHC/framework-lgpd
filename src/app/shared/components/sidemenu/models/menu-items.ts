import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { MenuItemButton } from './buttons/menu-item-button';
import { OnInit } from '@angular/core';

export class MenuItems {

    menuItems: MenuItemButton[] = [];

    constructor(private authService: AuthService) {
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
            }, {
                label: "Metadados",
                link: "metadados",
                icon: "event_seat",
                hidden: false
            }, {
                label: "Compartilhamento",
                link: "compartilhamento",
                icon: "event_seat",
                hidden: false
            }, {
                label: "Local Armazenamento",
                link: "local-armazenamento",
                icon: "event_seat",
                hidden: false
            }, {
                label: "Ciclo Monitoramento",
                link: "ciclo-monitoramento",
                icon: "event_seat",
                hidden: false
            }, {
                label: "Data Flow",
                link: "data-flow",
                icon: "event_seat",
                hidden: false
            }
        ];
    }
}
