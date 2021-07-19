import { NgModule } from '@angular/core';
import { BaseLegalListComponent } from './base-legal-list.component'
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: BaseLegalListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseLegalListRoutingModule { }
