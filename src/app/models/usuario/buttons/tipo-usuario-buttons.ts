import { AbstractButton } from 'src/app/shared/models/abstract-button';

export class TipoUsuarioButtons {
    buttons: AbstractButton[] = [
        {
            cod: 1,
            description: "Comum"
        },
        {
            cod: 2,
            description: "Controlador"
        },
        {
            cod: 3,
            description: "Operador"
        },
        {
            cod: 4,
            description: "Encarregado"
        },
        {
            cod: 5,
            description: "Administrador"
        }
    ]
}
