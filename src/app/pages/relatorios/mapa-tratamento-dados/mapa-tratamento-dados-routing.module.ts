import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaTratamentoDadosComponent } from './mapa-tratamento-dados.component';


const routes: Routes = [
  {
      path: "",
      component: MapaTratamentoDadosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaTratamentoDadosRoutingModule { }
