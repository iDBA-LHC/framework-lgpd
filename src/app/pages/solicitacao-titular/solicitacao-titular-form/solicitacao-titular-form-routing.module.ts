import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitacaoTitularFormComponent } from './solicitacao-titular-form.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: "",
  component: SolicitacaoTitularFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoTitularFormRoutingModule { }
