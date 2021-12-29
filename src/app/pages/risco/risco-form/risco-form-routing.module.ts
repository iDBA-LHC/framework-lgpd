import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiscoFormComponent } from './risco-form.component';

const routes: Routes = [
  {
      path: "",
      component: RiscoFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiscoFormRoutingModule { }
