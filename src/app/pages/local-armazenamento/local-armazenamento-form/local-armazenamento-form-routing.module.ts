import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalArmazenamentoFormComponent } from './local-armazenamento-form.component';


const routes: Routes = [{
  path: "",
  component: LocalArmazenamentoFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalArmazenamentoFormRoutingModule { }
