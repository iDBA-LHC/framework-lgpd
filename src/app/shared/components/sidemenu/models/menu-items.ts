import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { MenuItemButton } from './buttons/menu-item-button';

export class MenuItems {

	menuItems: MenuItemButton[] = [];

	constructor(private authService: AuthService) {
		this.menuItems = [{
			label: "Usuário",
			link: "usuario",
			icon: "account_circle",
			hidden: false,
		}, {
			label: "Empresa",
			link: "empresa",
			icon: "work",
			hidden: this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin ? false : true,
		}, {
			label: "Area",
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
			label: "Ciclo de Monit.",
			link: "ciclo-monitoramento",
			icon: "settings_backup_restore",
			hidden: false,
		}, {
			label: "Forma Coleta",
			link: "forma-coleta",
			icon: "wifi_protected_setup",
			hidden: false,
		}, {
			label: "Metadados",
			link: "metadados",
			icon: "vertical_split",
			hidden: false
		}, {
			label: "Compartilhamento",
			link: "compartilhamento",
			icon: "mobile_screen_share",
			hidden: false
		}, {
			label: "Local Armazenamento",
			link: "local-armazenamento",
			icon: "inventory_2",
			hidden: false
		}, {
			label: "Data Map",
			link: "data-map",
			icon: "travel_explore",
			hidden: false
		}, {
			label: "Plano Mitigação",
			link: "plano-mitigacao",
			icon: "control_camera",
			hidden: false
		}, {
			label: "Data Flow",
			link: "data-flow",
			icon: "account_tree",
			hidden: false
        }];
	}
}
