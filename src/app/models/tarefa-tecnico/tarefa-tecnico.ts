import { Tecnico } from '../tecnico/tecnico';
import { Projeto } from '../projeto/projeto';

export class TarefaTecnico {
    codigoTecnico: string;
    codigoProjeto: number;
    nomeProjeto: string;
    codigoTarefa: number;
    nomeTarefa: string;
    horasDisponiveis: number;
    horasAlocadas: number;
}
