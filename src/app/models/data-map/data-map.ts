import { Compartilhamento } from "../compartilhamento/compartilhamento";
import { FormaColeta } from "../forma-coleta/forma-coleta";
import { LocalArmazenamento } from "../local-armazenamento/local-armazenamento";

export class DataMap {
    codDataMap: number;
    codCicloMonitoramento: number;
    codAtividade: number;
    indTipo: number; // nao sei que campo é esse
    
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
}
