import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanoMitigacaoFormComponent } from './plano-mitigacao-form/plano-mitigacao-form.component';

const routes: Routes = [{
  path: "",
  component: PlanoMitigacaoFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanoMitigacaoRoutingModule { }
