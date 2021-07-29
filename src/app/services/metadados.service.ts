import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Metadados } from "../models/metadados/metadados";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})

export class MetadadosService {
    private apiSufix: string = "metadados/";

    constructor(private http: HttpClient, 
        private authService: AuthService) {
        
    }

    listaTodosMetadados() {
        return this.http.get<Metadados[]>(
            `${environment.apiURL}${this.apiSufix}`, { observe: "response"});
    }

    incluirMetadados(metadados: Metadados) {
        return this.http.post(`${environment.apiURL}${this.apiSufix}`, metadados, { observe: "response" });
    }

    pesquisaMetadados(id: number) {
        return this.http.get<Metadados>(`${environment.apiURL}${this.apiSufix}${id}`, { observe: "response" });
    }

    alterarMetadados(metadados: Metadados) {
        return this.http.put<Metadados>(
            `${environment.apiURL}${this.apiSufix}`, 
            metadados,
            { observe: "response" }
        )
    }
}