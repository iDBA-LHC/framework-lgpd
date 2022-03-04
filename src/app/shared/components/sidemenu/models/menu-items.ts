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
					link: "priva/usuario",
					icon: "account_circle",
					hidden: this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin ? false : true,
				}, 
				{
					label: "Controladora",
					link: "priva/controladora",
					icon: "work",
					hidden: this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin ? false : true,
				}, {
					label: "Área",
					link: "priva/area",
					icon: "event_seat",
					hidden: false,
				}, {
					label: "Base Legal",
					link: "priva/base-legal",
					icon: "account_balance",
					hidden: false,
				}, {
					label: "Ciclo de Vida",
					link: "priva/ciclo-de-vida",
					icon: "donut_large",
					hidden: false,
				}, {
					label: "Forma de Coleta",
					link: "priva/forma-coleta",
					icon: "wifi_protected_setup",
					hidden: false,
				}, {
					label: "Metadados",
					link: "priva/metadados",
					icon: "vertical_split",
					hidden: false,
				}, {
					label: "Compartilhamento",
					link: "priva/compartilhamento",
					icon: "mobile_screen_share",
					hidden: false,
				}, {
					label: "Armazenamento",
					link: "priva/local-armazenamento",
					icon: "inventory_2",
					hidden: false,
				}, {
					label: "Risco",
					link: "priva/risco",
					icon: "report",
					hidden: false,
				}, {
					label: "Risco Associado",
					link: "priva/risco-associado",
					icon: "apps_outage",
					hidden: false,
				}, {
					label: "Ameaças",
					link: "priva/ameaca",
					icon: "social_distance",
					hidden: false,
				}, {
					label: "Ciclo Monitoramento",
					link: "priva/ciclo-monitoramento",
					icon: "settings_backup_restore",
					hidden: false,
				}
			]
		},	
		{
			label: "Data Flow",
			link: "priva/data-flow",
			icon: "account_tree",
			hidden: false,
    	}, {
			label: "Data Map",
			link: "priva/data-map",
			icon: "travel_explore",
			hidden: false,
		}, {
			label: "Data Analisys Map",
			link: "priva/data-analisys-map",
			icon: "travel_explore",
			hidden: false,
		}, {
			label: "Data Governance Map",
			link: "priva/data-governance-map",
			icon: "travel_explore",
			hidden: false,
    	},
		{
			label: "Registro de Incidente",
			link: "priva/incidente",
			icon: "report_problem",
			hidden: this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin ||
					this.authService.getLoggedUserType() === environment.tipoUsuarioEncarregado ? false : true,
    	},
		{
			label: "Solicitação de Titulares",
			link: "priva/solicitacao-titular",
			icon: "list_alt",
			hidden: this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin ||
					this.authService.getLoggedUserType() === environment.tipoUsuarioEncarregado ? false : true,
    	},
		{
			label: "Relatórios",
			icon: "menu",
			link: "",
			hidden: false,
			items: 
			[
				{
					label: "Tratamento Dados",
					link: "priva/mapa-tratamento-dados",
					icon: "travel_explore",
					hidden: false,
				}, 
				{
					label: "Contratos",
					link: "priva/inventario-contratos",
					icon: "work",
					hidden: false,
				},
				{
					label: "Riscos",
					link: "priva/mapa-riscos",
					icon: "travel_explore",
					hidden: false,
				}
			]
		}
	]};
}
