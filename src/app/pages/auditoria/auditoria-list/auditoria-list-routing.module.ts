import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuditoriaListComponent } from './auditoria-list.component';

const routes: Routes = [
  {
    path: "",
    component: AuditoriaListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AuditoriaListRoutingModule { }
