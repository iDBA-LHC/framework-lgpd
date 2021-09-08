import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataFlow } from '../models/data-flow/data-flow';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})

export class DataFlowService {

	apiSuffix = "data_flow/";
	constructor(private http: HttpClient,
		private authService: AuthService) { }

	listaTodosDataFlow() {
		return this.http.get<DataFlow[]>(`${environment.apiURL}${this.apiSuffix}`, { observe: "response" });
	}

	incluirDataFlow(DataFlow: DataFlow) {
		return this.http.post(`${environment.apiURL}${this.apiSuffix}`, DataFlow, { observe: "response" });
	}

	pesquisaDataFlow(id: number) {
		return this.http.get<DataFlow>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
	}

	alterarDataFlow(DataFlow: DataFlow) {
		return this.http.put<DataFlow>(`${environment.apiURL}${this.apiSuffix}`, DataFlow, { observe: "response" });
	}
}
