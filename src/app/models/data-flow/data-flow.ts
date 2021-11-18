import { Compartilhamento } from "../compartilhamento/compartilhamento";
import { LocalArmazenamento } from "../local-armazenamento/local-armazenamento";
import { Usuario } from '../usuario/usuario';
import { Metadados } from '../metadados/metadados';
import { FormaColeta } from '../forma-coleta/forma-coleta';

export class DataFlow {
  codDataFlow: number;
  nomeProcessamento: string;
  codCicloMonitoramento: number;
  codAtividade: number;
  indDescarte: number;
  indRisco: number;
  codCicloVida: number;
  codUsuarioInclusao: number;
  formaColetas: Array<FormaColeta>;
  usuarios: Array<Usuario>;
  armazenamentos: Array<LocalArmazenamento>;
  compartilhamentos: Array<Compartilhamento>;
  metadados: Array<Metadados>;
  
  nomeCicloMonitoramento: string;
  dataCompetencia: Date;

  nomeAtividade: string;
  codProcesso: number;
  nomeProcesso: string;
  codArea: number;
  nomeArea: string;
  codEmpresa: number;
  nomeEmpresa: string;  
}
