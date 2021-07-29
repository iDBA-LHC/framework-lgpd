import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompartilhamentoFormComponent } from './compartilhamento-form.component';


const routes: Routes = [{
  path: "",
  component: CompartilhamentoFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompartilhamentoFormRoutingModule { }
