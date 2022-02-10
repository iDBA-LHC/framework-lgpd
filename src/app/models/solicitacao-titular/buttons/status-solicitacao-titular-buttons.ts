import { AbstractButton } from "src/app/shared/models/abstract-button";

export class StatusSolicitacaoTitularButtons {
    buttons: AbstractButton[] = [
        {
            cod: 1,
            description: "Em Andamento"
        },
        {
            cod: 2,
            description: "Fechada"
        },
        {
            cod: 3,
            description: "Indeferida"
        },
        {
            cod:0,
            description: "Todas"
        }
    ]
}
