import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalArmazenamentoListComponent } from './local-armazenamento-list.component';


const routes: Routes = [{
  path: "",
  component: LocalArmazenamentoListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LocalArmazenamentoListRoutingModule { }
