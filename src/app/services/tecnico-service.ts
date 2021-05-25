import { Tecnico } from '../models/tecnico/tecnico';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class TecnicoService {


    pesquisaTecnico(rowid: string)
    {
        var tecnico:Tecnico = new Tecnico();
        tecnico.codigoTecnico = rowid;
        tecnico.nomeTecnico = "Tecnico " + rowid;
        return tecnico;

    }
}
