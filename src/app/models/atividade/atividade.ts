import { Metadados } from '../metadados/metadados';

export class Atividade {
    codAtividade: number;
    nomeAtividade: string;
    codProcesso: number;
    obsAtividade: string;
    codUsuarioAlteracao: number;
    metadados: Array<Metadados>;
    indAutomatizado: number;
}