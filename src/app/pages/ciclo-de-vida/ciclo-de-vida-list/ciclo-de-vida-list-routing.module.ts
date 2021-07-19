import { NgModule } from '@angular/core';
import { CicloDeVidaListComponent } from './ciclo-de-vida-list.component'
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: CicloDeVidaListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CicloDeVidaListRoutingModule { }
