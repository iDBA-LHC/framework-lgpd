import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { AreaFormComponent } from './area-form.component';

const routes: Routes = [
  {
    path: "",
    component: AreaFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaFormRoutingModule { }
