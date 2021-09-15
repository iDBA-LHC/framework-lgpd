import { Compartilhamento } from "../compartilhamento/compartilhamento";
import { FormaColeta } from "../forma-coleta/forma-coleta";
import { LocalArmazenamento } from "../local-armazenamento/local-armazenamento";

export class DataMap {
    codDataMap: number;
    codCicloMonitoramento: number;
    codAtividade: number;
	// 0 - DataMap / 1 - DataAnalisysMap
    indTipo: number;
  	codMetadados: number;
    codBaseLegal: number;
    indPrincipios: number;
    indSensivel: number;
    indDadosMenores: number;
  	formaColetas: Array<FormaColeta>;
    indNecessitaConsentimento: number;
  	armazenamentos: Array<LocalArmazenamento>;
  	indTransfInternacional: number;
  	compartilhamentos: Array<Compartilhamento>;
    indAnonimizacao: number;
  	codCicloVida: number;
    indRisco: number;
    desObservacoes: string;
    nomeCicloMonitoramento: string;
    nomeAtividade: string;
    codProcesso: number;
    nomeProcesso: number;
    codArea: number;
    nomeArea: string;
    codEmpresa: number;
    nomeEmpresa: string;
}
