import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RIPDListComponent } from './ripd-list.component';

const routes: Routes = [
  {
    path: "",
    component: RIPDListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RIPDListRoutingModule { }
