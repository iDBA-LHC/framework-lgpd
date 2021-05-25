import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AgendaListComponent } from './agenda-list.component';

const routes: Routes = [
  {
    path: "",
    component: AgendaListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaListRoutingModule { }
