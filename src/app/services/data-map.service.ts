import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataMap } from '../models/data-map/data-map';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})

export class DataMapService {

	apiSuffix = "data_map/";
	constructor(private http: HttpClient,
		private authService: AuthService) { }

	listaTodosDataMap(indTipo: number) {
		return this.http.get<DataMap[]>(`${environment.apiURL}${this.apiSuffix}tipo?indTipo=${indTipo}`, { observe: "response" });
	}

	incluirDataMap(DataMap: DataMap) {
		return this.http.post(`${environment.apiURL}${this.apiSuffix}`, DataMap, { observe: "response" });
	}

	pesquisaDataMap(id: number) {
		return this.http.get<DataMap>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
	}

	alterarDataMap(DataMap: DataMap) {
		return this.http.put<DataMap>(`${environment.apiURL}${this.apiSuffix}`, DataMap, { observe: "response" });
	}

	pesquisaDataMapCicloAtividadeTipo(codigoClicloMonitoramento: number, codigoAtividade: number, indTipo: number) {
		return this.http.get<DataMap>(`${environment.apiURL}${this.apiSuffix}ciclo_monitoramento/${codigoClicloMonitoramento}/atividade/${codigoAtividade}/tipo/${indTipo}`, { observe: "response" });
	}
}
