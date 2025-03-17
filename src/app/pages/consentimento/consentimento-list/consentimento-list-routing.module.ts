import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConsentimentoListComponent } from './consentimento-list.component';

const routes: Routes = [
  {
    path: "",
    component: ConsentimentoListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ConsentimentoListRoutingModule { }
