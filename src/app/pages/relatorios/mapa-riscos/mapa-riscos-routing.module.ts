import { NgModule } from '@angular/core';
import { MapaRiscosComponent } from './mapa-riscos.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
      path: "",
      component: MapaRiscosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaRiscosRoutingModule { }
