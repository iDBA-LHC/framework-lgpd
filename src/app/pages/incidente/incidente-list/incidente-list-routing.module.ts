import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidenteListComponent } from './incidente-list.component';

const routes: Routes = [
  {
      path: "",
      component: IncidenteListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidenteListRoutingModule { }
