import { Compartilhamento } from "../compartilhamento/compartilhamento";
import { LocalArmazenamento } from "../local-armazenamento/local-armazenamento";
import { Usuario } from '../usuario/usuario';

export class DataFlow {
  codDataFlow: number;
  nomeProcessamento: string;
  codCicloMonitoramento: number;
  codAtividade: number;
  codMetadados: number;
  indDescarte: number;
  indRisco: number;
  codCicloVida: number;
  codUsuarioInclusao: number;
  usuarios: Array<Usuario>;
  armazenamentos: Array<LocalArmazenamento>;
  compartilhamentos: Array<Compartilhamento>;
  nomeCicloMonitoramento: string;
  nomeAtividade: string;
  codProcesso: number;
  nomeProcesso: string;
  codArea: number;
  nomeArea: string;
  codEmpresa: number;
  nomeEmpresa: string;
}
