import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiscoAssociadoFormComponent } from './risco-associado-form.component';

const routes: Routes = [
  {
      path: "",
      component: RiscoAssociadoFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiscoAssociadoFormRoutingModule { }
