import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { CicloDeVidaFormComponent } from './ciclo-de-vida-form.component';

const routes: Routes = [
  {
    path: "",
    component: CicloDeVidaFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CicloDeVidaFormRoutingModule { }
