import { Usuario } from "../usuario/usuario";

export class CicloMonitoramento {
	codCicloMonitoramento: number;
	nomeCicloMonitoramento: string;
	codEmpresa: number;
	dataCompetencia: Date;
	codUsuarioInclusao: number;
	usuarios: Array<Usuario>;
	nomeEmpresa: string;
}
