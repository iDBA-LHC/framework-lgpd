import { FormaColeta } from 'src/app/models/forma-coleta/forma-coleta';
import { Compartilhamento } from '../compartilhamento/compartilhamento';
import { LocalArmazenamento } from '../local-armazenamento/local-armazenamento';

export class DataMap {
    codDataMap: number;
    codCicloMonitoramento: number;
    codAtividade: number;
    indTipo: number;
    codCicloVida: number;
    codBaseLegal: number;
    codMetaDados: number;
    indPrincipios: number;
    indSensivel: number;
    indDadosMenores: number;
    indNecessitaConsentimento: number;
    indTransfInternacional: number;
    indAnonimizacao: number;
    indRisco: number;
    desobservacoes: string;
    formaColetas: Array<FormaColeta;
    compartilhamentos: Array<Compartilhamento;
    armazenamentos: Array<LocalArmazenamento;
}
