import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompartilhamentoListComponent } from './compartilhamento-list.component';


const routes: Routes = [{
  path: "",
  component: CompartilhamentoListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompartilhamentoListRoutingModule { }
