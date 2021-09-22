import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PlanoMitigacao } from '../models/plano-mitigacao/plano-mitigacao';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})

export class PlanoMitigacaoService {

	apiSuffix = "plano_mitigacao/";
	constructor(private http: HttpClient,
		private authService: AuthService) { }

	listaTodosPlanoMitigacao(codDataMap: number) {
		return this.http.get<PlanoMitigacao[]>(`${environment.apiURL}${this.apiSuffix}`, { observe: "response" });
	}

	incluirPlanoMitigacao(PlanoMitigacao: PlanoMitigacao) {
		return this.http.post(`${environment.apiURL}${this.apiSuffix}`, PlanoMitigacao, { observe: "response" });
	}

	pesquisaPlanoMitigacao(id: number) {
		return this.http.get<PlanoMitigacao>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
	}

	alterarPlanoMitigacao(PlanoMitigacao: PlanoMitigacao) {
		return this.http.put<PlanoMitigacao>(`${environment.apiURL}${this.apiSuffix}`, PlanoMitigacao, { observe: "response" });
	}
}
