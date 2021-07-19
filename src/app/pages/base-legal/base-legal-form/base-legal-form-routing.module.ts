import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { BaseLegalFormComponent } from './base-legal-form.component';

const routes: Routes = [
  {
    path: "",
    component: BaseLegalFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseLegalFormRoutingModule { }
