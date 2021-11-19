import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { MenuItemButton } from './buttons/menu-item-button';

export class MenuItems {

	menuItems = [];

	constructor(private authService: AuthService) {
		this.menuItems = [
		{
			label: "Cadastros",
			icon: "menu",
			link: "",
			hidden: false,
			items: 
			[
				{
					label: "Usuário",
					link: "usuario",
					icon: "account_circle",
					hidden: this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin ? false : true,
				}, 
				{
					label: "Controladora",
					link: "controladora",
					icon: "work",
					hidden: this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin ? false : true,
				}, {
					label: "Área",
					link: "area",
					icon: "event_seat",
					hidden: false,
				}, {
					label: "Base Legal",
					link: "base-legal",
					icon: "account_balance",
					hidden: false,
				}, {
					label: "Ciclo de Vida",
					link: "ciclo-de-vida",
					icon: "donut_large",
					hidden: false,
				}, {
					label: "Forma de Coleta",
					link: "forma-coleta",
					icon: "wifi_protected_setup",
					hidden: false,
				}, {
					label: "Metadados",
					link: "metadados",
					icon: "vertical_split",
					hidden: false,
				}, {
					label: "Compartilhamento",
					link: "compartilhamento",
					icon: "mobile_screen_share",
					hidden: false,
				}, {
					label: "Armazenamento",
					link: "local-armazenamento",
					icon: "inventory_2",
					hidden: false,
				}, {
					label: "Ciclo Monitoramento",
					link: "ciclo-monitoramento",
					icon: "settings_backup_restore",
					hidden: false,
				}
			]
		},	
		{
			label: "Data Flow",
			link: "data-flow",
			icon: "account_tree",
			hidden: false,
    	}, {
			label: "Data Map",
			link: "data-map",
			icon: "travel_explore",
			hidden: false,
		}, {
			label: "Data Analisys Map",
			link: "data-analisys-map",
			icon: "travel_explore",
			hidden: false,
    	} ];
	}
}
