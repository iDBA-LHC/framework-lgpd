import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanoMitigacaoListComponent } from './plano-mitigacao-list.component';


const routes: Routes = [{
  path: "",
  component: PlanoMitigacaoListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PlanoMitigacaoListRoutingModule { }
