import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Area } from '../models/area/area';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class AreaService {
	constructor(private http: HttpClient,
		private authService: AuthService,) { }

	listaTodasAreas() {
		return this.http.get<Area[]>(environment.apiURL + "area", { observe: "response" });
	}

	listaAreasPorEmpresa(codEmpresa: number) {
		return this.http.get<Area[]>(environment.apiURL + `area/empresa/${codEmpresa}`, { observe: "response" });
	}

	incluirArea(area: Area) {
		return this.http.post(`${environment.apiURL}area/`, area, { observe: "response" });
	}

	pesquisaArea(id: number) {
		return this.http.get<Area>(`${environment.apiURL}area/${id}`, { observe: "response" })
	}

	alterarArea(area: Area) {
		return this.http.put<Area>(`${environment.apiURL}area/`, area, { observe: "response" });
	}
}
