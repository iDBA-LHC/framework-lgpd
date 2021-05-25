import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaFormComponent } from './agenda-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: AgendaFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaFormRoutingModule { }
