import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiscoListComponent } from './risco-list.component';

const routes: Routes = [
  {
      path: "",
      component: RiscoListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiscoListRoutingModule { }
