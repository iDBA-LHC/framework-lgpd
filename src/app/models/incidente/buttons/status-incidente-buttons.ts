import { AbstractButton } from "src/app/shared/models/abstract-button";

export class StatusIncidenteButtons {
    buttons: AbstractButton[] = [
        {
            cod: 1,
            description: "Em Andamento"
        },
        {
            cod: 2,
            description: "Solucionado"
        },
        {
            cod: 0,
            description: "Todos"
        },
    ]
}
