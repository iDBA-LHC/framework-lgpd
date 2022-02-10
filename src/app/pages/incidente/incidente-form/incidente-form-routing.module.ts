import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidenteFormComponent } from './incidente-form.component';

const routes: Routes = [{
  path: "",
  component: IncidenteFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidenteFormRoutingModule { }
