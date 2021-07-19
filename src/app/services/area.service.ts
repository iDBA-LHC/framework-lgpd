import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Area } from '../models/area/area';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  constructor(private http: HttpClient,
              private authService: AuthService, ) {}
            
  listaTodasAreas()
  {
    return this.http.get<Area[]>(environment.apiURL + "area", { observe: "response" });
  }
}
