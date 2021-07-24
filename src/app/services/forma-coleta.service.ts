import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { FormaColeta } from "../models/forma-coleta/forma-coleta";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})

export class FormaColetaService {
    constructor(private http: HttpClient,
        private authService: AuthService) {

    }

    listaTodasFormaColeta() {
        return this.http.get<FormaColeta[]>(`${environment.apiURL}forma_coleta/`, {observe: "response"});
    }

    incluirFormaColeta(formaColeta: FormaColeta) {
        return this.http.post(`${environment.apiURL}forma_coleta/`, formaColeta, {observe:"response"});
    }

    pesquisaFormaColeta(id: number) {
        return this.http.get<FormaColeta>(`${environment.apiURL}forma_coleta/${id}`, {observe: "response"});
    }

    alterarFormaColeta(formaColeta: FormaColeta) {
        return this.http.put<FormaColeta>(
            `${environment.apiURL}forma_coleta/`,
            formaColeta, {observe: "response"}
        );
    }
}