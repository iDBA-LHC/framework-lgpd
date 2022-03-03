import { AbstractButton } from "src/app/shared/models/abstract-button";

export class DireitoSolicitacaoTitularButtons {
    buttons: AbstractButton[] = [
        {
            cod: 1,
            description: "Direito de Acesso e Portabilidade dos Dados"
        },
        {
            cod: 2,
            description: "Direito de Retificação dos Dados"
        },
        {
            cod: 3,
            description: "Direito de Exclusão dos Dados"
        },
        {
            cod: 4,
            description: "Anonimização"
        }
    ];
}
