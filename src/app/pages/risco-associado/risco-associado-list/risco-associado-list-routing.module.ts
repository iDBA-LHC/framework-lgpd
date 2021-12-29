import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiscoAssociadoListComponent } from './risco-associado-list.component';

const routes: Routes = [
  {
      path: "",
      component: RiscoAssociadoListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiscoAssociadoListRoutingModule { }
