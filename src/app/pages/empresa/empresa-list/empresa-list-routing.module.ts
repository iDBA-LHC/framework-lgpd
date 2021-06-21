import { NgModule } from '@angular/core';
import { EmpresaListComponent } from './empresa-list.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: EmpresaListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaListRoutingModule { }
